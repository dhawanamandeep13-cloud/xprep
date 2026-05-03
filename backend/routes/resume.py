from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from openai_service import OpenAIService
from io import BytesIO
from pypdf import PdfReader
from docx import Document

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

class CVJDRequest(BaseModel):
    cv_text: str
    jd_text: str

class EnhanceCVRequest(BaseModel):
    cv_text: str
    jd_text: Optional[str] = ""
    missing_keywords: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)

async def extract_upload_text(file: UploadFile) -> str:
    content = await file.read()
    filename = (file.filename or "").lower()
    content_type = (file.content_type or "").lower()

    if filename.endswith(".txt") or content_type == "text/plain":
        return content.decode("utf-8", errors="ignore").strip()

    if filename.endswith(".pdf") or content_type == "application/pdf":
        reader = PdfReader(BytesIO(content))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages).strip()

    if (
        filename.endswith(".docx")
        or content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ):
        document = Document(BytesIO(content))
        paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
        return "\n".join(paragraphs).strip()

    raise HTTPException(status_code=400, detail="Please upload a PDF, DOCX, or TXT file")

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

@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        text = await extract_upload_text(file)
        if not text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract readable text from this file. Please try a text-based PDF, DOCX, or paste the content."
            )

        return {
            "filename": file.filename,
            "text": text
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not extract text from uploaded file: {str(e)}"
        )

@router.post("/cv-vs-jd")
async def compare_cv_jd(request: CVJDRequest):
    try:
        if not request.cv_text.strip():
            raise HTTPException(status_code=422, detail="CV text is required")
        if not request.jd_text.strip():
            raise HTTPException(status_code=422, detail="Job description text is required")

        return OpenAIService.compare_cv_to_jd(
            cv_text=request.cv_text,
            jd_text=request.jd_text
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enhance-cv")
async def enhance_cv(request: EnhanceCVRequest):
    try:
        if not request.cv_text.strip():
            raise HTTPException(status_code=422, detail="CV text is required")

        return OpenAIService.enhance_cv_for_jd(
            cv_text=request.cv_text,
            jd_text=request.jd_text or "",
            missing_keywords=request.missing_keywords or [],
            recommendations=request.recommendations or []
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
