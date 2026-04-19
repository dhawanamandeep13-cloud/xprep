from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid


# ---------------------------
# Interview Models
# ---------------------------

class InterviewStartRequest(BaseModel):
    interview_type: str
    role: Optional[str] = "Software Engineer"
    experience_level: Optional[str] = "mid"


class InterviewAnswerRequest(BaseModel):
    session_id: str
    question_id: int
    answer_text: str
    audio_duration_seconds: Optional[int] = 0


class InterviewFeedback(BaseModel):
    score: int
    strengths: List[str]
    improvements: List[str]
    suggestion: str


# ---------------------------
# Resume Models
# ---------------------------

class ResumeSuggestionRequest(BaseModel):
    section: str
    current_text: Optional[str] = ""
    role: Optional[str] = "Software Engineer"
    experience_years: Optional[int] = 5


class ResumeAnalysisRequest(BaseModel):
    resume_content: Dict[str, str]
    target_role: str


class ATSAnalysis(BaseModel):
    ats_score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    strengths: List[str]
    improvements: List[str]
    section_scores: Dict[str, int]
    recommendations: List[str]


# ---------------------------
# Job Models
# ---------------------------

class JobPreferences(BaseModel):
    role: str
    location: str
    experience_level: str
    job_type: str


class JobSearchRequest(BaseModel):
    preferences: JobPreferences
    resume_data: Optional[Dict[str, Any]] = None


class JobListing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    location: str
    match_score: int
    match_reasons: List[str]
    salary: Optional[str] = ""
    job_type: Optional[str] = ""
    posted: Optional[str] = ""


# ---------------------------
# Interview Questions
# ---------------------------

class InterviewQuestion(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    companies: List[str]
    sample_answer: Optional[str] = None
    tips: Optional[List[str]] = None