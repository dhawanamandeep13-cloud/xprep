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

        print("Existing user:", existing_user)

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

        print("Hashed Password:", new_user.hashed_password)

        # Save user
        await db.users.insert_one(new_user.dict())

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


@router.post("/login")
async def login(user: UserLogin):
    try:
        print("\n========== LOGIN FUNCTION CALLED ==========")
        print("Email entered:", user.email)
        print("Password entered:", user.password)

        print("\n===== ALL USERS IN DATABASE =====")

        cursor = db.users.find({})

        async for u in cursor:
            print(u)

        print("=================================\n")

        # Find user
        existing_user = await db.users.find_one(
            {"email": user.email}
        )

        print("User from DB:", existing_user)

        if not existing_user:
            print("User not found in database")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        print("Stored Hash:", existing_user["hashed_password"])

        # Verify password
        result = verify_password(
            user.password,
            existing_user["hashed_password"]
        )

        print("Password Match:", result)

        if not result:
            print("Password verification failed")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Create JWT token
        token = create_access_token(
            {"sub": existing_user["email"]}
        )

        print("JWT Token Created Successfully")
        print("============================================")

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
        "user": {
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }