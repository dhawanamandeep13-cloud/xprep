import os

import razorpay
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["Payments"])

# Razorpay Client
client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)


@router.get("/payment/test")
async def payment_test():
    return {
        "message": "Razorpay Payment API is working"
    }