from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from openai_service import OpenAIService

router = APIRouter(prefix="/resume", tags=["resume"])

class ATSAnalysisRequest(BaseModel):
    resume_content: Optional[Dict[str, str]] = None
    resume_text: Optional[str] = None
    target_role: str

class ResumeSuggestionRequest(BaseModel):
    section: str
    current_text: Optional[str] = ""
    role: str
    experience_years: Optional[int] = 0

@router.post("/analyze-ats")
async def analyze_ats(request: ATSAnalysisRequest):
    try:
        resume_content = request.resume_content
        if resume_content is None and request.resume_text:
            resume_content = {"text": request.resume_text}
        if not resume_content:
            raise HTTPException(
                status_code=422,
                detail="Either resume_content or resume_text is required"
            )

        result = OpenAIService.analyze_ats_compatibility(
            resume_content=resume_content,
            target_role=request.target_role
        )
        return result
    except HTTPException:
        raise
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
