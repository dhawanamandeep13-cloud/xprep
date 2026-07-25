from fastapi import APIRouter, HTTPException
from models import UserRegister, UserLogin, UserInDB
from auth import hash_password, verify_password, create_access_token
from server import db

router = APIRouter(tags=["Authentication"])


@router.post("/register")
async def register(user: UserRegister):

    existing_user = await db.users.find_one({"email": user.email})

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

    await db.users.insert_one(new_user.dict())

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
async def login(user: UserLogin):

    existing_user = await db.users.find_one({"email": user.email})

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