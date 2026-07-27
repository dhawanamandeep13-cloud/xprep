from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin, UserInDB
from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
)
from database import db

print("AUTH.PY LOADED")

router = APIRouter(tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):
    print("REGISTER FUNCTION CALLED")
    print("================================")
    print("REGISTER FUNCTION CALLED")

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
        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not verify_password(
            user.password,
            existing_user["hashed_password"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

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
        print("\n========================")
        print("LOGIN ERROR")
        print(type(e).__name__)
        print(str(e))
        print("========================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )