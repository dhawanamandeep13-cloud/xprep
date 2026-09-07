import os
import traceback

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from logger import logger

from models import (
    UserRegister,
    UserInDB,
    UserUpdate,
    ChangePassword,
)

from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

from database import db


router = APIRouter(tags=["Authentication"])


# ============================================================
# Google OAuth configuration
# ============================================================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

if not GOOGLE_CLIENT_ID:
    logger.warning(
        "GOOGLE_CLIENT_ID is not configured. "
        "Google login will not work until it is added."
    )


# ============================================================
# Register
# ============================================================

@router.post("/register")
async def register(user: UserRegister):

    logger.info("Register endpoint called")

    try:
        existing_user = await db.users.find_one({
            "email": user.email
        })

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        new_user = UserInDB(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )

        await db.users.insert_one(
            new_user.model_dump()
        )

        logger.info(
            f"New user registered: {user.email}"
        )

        return {
            "message": "User registered successfully"
        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        logger.error(
            f"Registration failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Registration failed"
        )


# ============================================================
# Login
# ============================================================

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    logger.info("Login endpoint called")

    try:

        existing_user = await db.users.find_one({
            "email": form_data.username
        })

        if not existing_user:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not verify_password(
            form_data.password,
            existing_user["hashed_password"]
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token = create_access_token({
            "sub": existing_user["email"]
        })

        logger.info(
            f"User logged in: {existing_user['email']}"
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "name": existing_user["name"],
            "email": existing_user["email"],
            "redirectUrl": "/modules"
        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        logger.error(
            f"Login failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Login failed"
        )


# ============================================================
# Google Login
# ============================================================

@router.post("/auth/google")
async def google_login(payload: dict):

    try:

        credential = payload.get("credential")

        if not credential:

            raise HTTPException(
                status_code=400,
                detail="Google credential is missing"
            )

        if not GOOGLE_CLIENT_ID:

            raise HTTPException(
                status_code=500,
                detail="Google OAuth is not configured on the server"
            )

        # ----------------------------------------------------
        # Verify Google ID token
        # ----------------------------------------------------

        try:

            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )

        except ValueError:

            raise HTTPException(
                status_code=401,
                detail="Invalid Google credential"
            )

        # ----------------------------------------------------
        # Extract verified Google identity
        # ----------------------------------------------------

        email = google_user.get("email")
        name = google_user.get("name") or email
        email_verified = google_user.get("email_verified", False)

        if not email:

            raise HTTPException(
                status_code=401,
                detail="Google account email was not returned"
            )

        if not email_verified:

            raise HTTPException(
                status_code=401,
                detail="Google email address is not verified"
            )

        # ----------------------------------------------------
        # Find existing Xprep user
        # ----------------------------------------------------

        existing_user = await db.users.find_one({
            "email": email
        })

        # ----------------------------------------------------
        # Create Xprep account automatically if needed
        # ----------------------------------------------------

        if not existing_user:

            # Google users don't have a local password.
            # Create a random internal password hash so that
            # the existing UserInDB model remains compatible.

            import secrets

            temporary_password = secrets.token_urlsafe(32)

            new_user = UserInDB(
                name=name,
                email=email,
                hashed_password=hash_password(
                    temporary_password
                )
            )

            await db.users.insert_one(
                new_user.model_dump()
            )

            existing_user = await db.users.find_one({
                "email": email
            })

            logger.info(
                f"New Google user created: {email}"
            )

        else:

            logger.info(
                f"Existing Google user logged in: {email}"
            )

        # ----------------------------------------------------
        # Create Xprep JWT
        # ----------------------------------------------------

        token = create_access_token({
            "sub": email
        })

        # ----------------------------------------------------
        # Return session information to frontend
        # ----------------------------------------------------

        return {
            "access_token": token,
            "token_type": "bearer",
            "name": existing_user["name"],
            "email": existing_user["email"],
            "redirectUrl": "/modules"
        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        logger.error(
            f"Google login failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Google sign-in failed"
        )


# ============================================================
# Current User
# ============================================================

@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user)
):

    logger.info(
        f"Profile viewed: {current_user['email']}"
    )

    return {
        "message": "Authenticated successfully",
        "user": {
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }


# ============================================================
# Update Profile
# ============================================================

@router.put("/profile")
async def update_profile(
    user_data: UserUpdate,
    current_user=Depends(get_current_user)
):

    try:

        update_data = {}

        if user_data.name is not None:
            update_data["name"] = user_data.name

        if user_data.email is not None:

            existing = await db.users.find_one({
                "email": user_data.email,
                "_id": {
                    "$ne": current_user["_id"]
                }
            })

            if existing:

                raise HTTPException(
                    status_code=400,
                    detail="Email already in use"
                )

            update_data["email"] = user_data.email

        if update_data:

            await db.users.update_one(
                {
                    "_id": current_user["_id"]
                },
                {
                    "$set": update_data
                }
            )

        updated_user = await db.users.find_one({
            "_id": current_user["_id"]
        })

        logger.info(
            f"Profile updated: {updated_user['email']}"
        )

        return {
            "message": "Profile updated successfully",
            "user": {
                "name": updated_user["name"],
                "email": updated_user["email"]
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        logger.error(
            f"Profile update failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Profile update failed"
        )


# ============================================================
# Change Password
# ============================================================

@router.put("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user=Depends(get_current_user)
):

    try:

        if not verify_password(
            password_data.current_password,
            current_user["hashed_password"]
        ):

            raise HTTPException(
                status_code=400,
                detail="Current password is incorrect"
            )

        new_hash = hash_password(
            password_data.new_password
        )

        await db.users.update_one(
            {
                "_id": current_user["_id"]
            },
            {
                "$set": {
                    "hashed_password": new_hash
                }
            }
        )

        logger.info(
            f"Password changed for: {current_user['email']}"
        )

        return {
            "message": "Password changed successfully"
        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc()

        logger.error(
            f"Password change failed: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Password change failed"
        )