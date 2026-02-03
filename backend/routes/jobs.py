from fastapi import APIRouter
from models import JobSearchRequest
from openai_service import OpenAIService

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/search")
async def search_jobs(request: JobSearchRequest):
    """Search and match jobs with AI"""
    preferences_dict = request.preferences.dict()
    resume_data_dict = request.resume_data or {}
    
    jobs = OpenAIService.generate_job_matches(
        preferences=preferences_dict,
        resume_data=resume_data_dict
    )
    
    return {"jobs": jobs}
