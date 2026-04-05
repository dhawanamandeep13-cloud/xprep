from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from openai_service import OpenAIService

router = APIRouter()

class ATSAnalysisRequest(BaseModel):
    resume_content: Dict[str, str]
    target_role: str

class ResumeSuggestionRequest(BaseModel):
    section: str
    current_text: Optional[str] = `"
    role: str
    experience_years: Optional[int] = 0

@router.post("/analyze-ats")
async def analyze_ats(request: ATSAnalysisRequest):
    try:
        result = OpenAIService.analyze_ats_compatibility(
            resume_content=request.resume_content,
            target_role=request.target_role
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-suggestions")
async def generate_suggestions(request: ResumeSuggestionRequest):
    try:
        result = OpenAIService.generate_resume_suggestions(
            section=request.section,
            current_text=request.current_text,
            role=request.role,
            experience_years=request.experience_years
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))