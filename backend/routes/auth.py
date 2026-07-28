from fastapi import APIRouter, HTTPException, Depends
from models import UserRegister, UserLogin, UserInDB
from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from database import db

print("AUTH.PY LOADED")

router = APIRouter(tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):
    print("REGISTER FUNCTION CALLED")
    print("================================")

    try:
        # Check if user already exists
        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Create new user
        new_user = UserInDB(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )

        # Save user
        await db.users.insert_one(new_user.dict())

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


@router.post("/login")
async def login(user: UserLogin):
    try:
        # Find user
        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Debug prints
        print("Entered Password :", user.password)
        print("Stored Hash      :", existing_user["hashed_password"])

        # Verify password
        result = verify_password(
            user.password,
            existing_user["hashed_password"]
        )

        print("Password Match   :", result)

        if not result:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Create JWT token
        token = create_access_token(
            {"sub": existing_user["email"]}
        )

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


@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated successfully",
        "user": current_user
    }