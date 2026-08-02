from fastapi import APIRouter, HTTPException, Depends
from models import (
    UserRegister,
    UserLogin,
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

print("AUTH.PY LOADED")

router = APIRouter(tags=["Authentication"])


# ----------------------------
# Register
# ----------------------------
@router.post("/register")
async def register(user: UserRegister):
    print("REGISTER FUNCTION CALLED")
    print("================================")

    try:
        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        print("Existing user:", existing_user)

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

        print("Hashed Password:", new_user.hashed_password)

        # Pydantic v2
        await db.users.insert_one(new_user.model_dump())

        print("User inserted successfully")

        return {
            "message": "User registered successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        print("\n========== REGISTER ERROR ==========")
        traceback.print_exc()
        print("====================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ----------------------------
# Login
# ----------------------------
@router.post("/login")
async def login(user: UserLogin):
    try:
        print("\n========== LOGIN FUNCTION CALLED ==========")
        print("Email entered:", user.email)

        print("\n===== ALL USERS IN DATABASE =====")

        cursor = db.users.find({})

        async for u in cursor:
            print(u)

        print("=================================\n")

        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        print("User from DB:", existing_user)

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        result = verify_password(
            user.password,
            existing_user["hashed_password"]
        )

        print("Password Match:", result)

        if not result:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token = create_access_token(
            {"sub": existing_user["email"]}
        )

        print("JWT Token Created Successfully")

        return {
            "access_token": token,
            "token_type": "bearer",
            "name": existing_user["name"],
            "email": existing_user["email"]
        }

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        print("\n========== LOGIN ERROR ==========")
        traceback.print_exc()
        print("=================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ----------------------------
# Get Current User
# ----------------------------
@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated successfully",
        "user": {
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }


# ----------------------------
# Update Profile
# ----------------------------
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

            existing = await db.users.find_one(
                {
                    "email": user_data.email,
                    "_id": {"$ne": current_user["_id"]}
                }
            )

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Email already in use"
                )

            update_data["email"] = user_data.email

        if update_data:
            await db.users.update_one(
                {"_id": current_user["_id"]},
                {"$set": update_data}
            )

        updated_user = await db.users.find_one(
            {"_id": current_user["_id"]}
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
        import traceback

        print("\n========== PROFILE UPDATE ERROR ==========")
        traceback.print_exc()
        print("==========================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ----------------------------
# Change Password
# ----------------------------
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
            {"_id": current_user["_id"]},
            {
                "$set": {
                    "hashed_password": new_hash
                }
            }
        )

        return {
            "message": "Password changed successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        import traceback

        print("\n========== CHANGE PASSWORD ERROR ==========")
        traceback.print_exc()
        print("===========================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )