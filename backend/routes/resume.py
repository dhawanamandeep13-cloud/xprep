from fastapi import APIRouter
from models import ResumeSuggestionRequest, ResumeAnalysisRequest
from openai_service import OpenAIService

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/generate-suggestions")
async def generate_suggestions(request: ResumeSuggestionRequest):
    """Generate AI-powered resume suggestions"""
    suggestions = OpenAIService.generate_resume_suggestions(
        section=request.section,
        current_text=request.current_text,
        role=request.role,
        experience_years=request.experience_years
    )
    
    return {"suggestions": suggestions}

@router.post("/analyze-ats")
async def analyze_ats(request: ResumeAnalysisRequest):
    """Analyze resume for ATS compatibility"""
    analysis = OpenAIService.analyze_ats_compatibility(
        resume_content=request.resume_content,
        target_role=request.target_role
    )
    
    return analysis
