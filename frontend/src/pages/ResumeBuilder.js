from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from backend.openai_service import OpenAIService

router = APIRouter()


# ─── Request Models ────────────────────────────────────────────────────────────

class ATSAnalysisRequest(BaseModel):
    resume_content: Dict[str, str]   # e.g. {"text": "full resume text here"}
    target_role: str


class ResumeSuggestionRequest(BaseModel):
    section: str
    current_text: Optional[str] = ""
    role: str
    experience_years: Optional[int] = 0


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/analyze-ats")
async def analyze_ats(request: ATSAnalysisRequest):
    """
    Analyze resume for ATS compatibility.
    Returns detailed score, matched/missing keywords, strengths,
    improvements, section scores, and recommendations.
    """
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
    """
    Generate AI-powered suggestions for a specific resume section.
    Returns improved_text, keywords, and tips.
    """
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