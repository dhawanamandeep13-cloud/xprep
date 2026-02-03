from fastapi import APIRouter, HTTPException
from models import InterviewStartRequest, InterviewAnswerRequest, InterviewFeedback
from openai_service import OpenAIService
import uuid
from typing import Dict

router = APIRouter(prefix="/interview", tags=["interview"])

# In-memory session storage (use database in production)
active_sessions: Dict[str, dict] = {}

mock_questions = [
    {
        "id": 1,
        "text": "Tell me about yourself",
        "category": "Behavioral",
        "difficulty": "Easy"
    },
    {
        "id": 2,
        "text": "Describe a challenging project you worked on and how you handled it",
        "category": "Behavioral",
        "difficulty": "Medium"
    },
    {
        "id": 3,
        "text": "How do you handle tight deadlines and multiple priorities?",
        "category": "Behavioral",
        "difficulty": "Medium"
    },
    {
        "id": 4,
        "text": "What are your greatest strengths and how do they apply to this role?",
        "category": "Behavioral",
        "difficulty": "Easy"
    }
]

@router.post("/mock/start")
async def start_mock_interview(request: InterviewStartRequest):
    """Start a new mock interview session"""
    session_id = str(uuid.uuid4())
    
    # Get first question based on interview type
    question = mock_questions[0]
    
    # Store session
    active_sessions[session_id] = {
        "interview_type": request.interview_type,
        "role": request.role,
        "current_question_index": 0,
        "answers": []
    }
    
    return {
        "session_id": session_id,
        "question": question
    }

@router.post("/mock/answer")
async def submit_answer(request: InterviewAnswerRequest):
    """Submit answer and get AI feedback"""
    if request.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[request.session_id]
    current_question = mock_questions[session["current_question_index"]]
    
    # Generate AI feedback using OpenAI
    feedback = OpenAIService.generate_interview_feedback(
        question=current_question["text"],
        answer=request.answer_text
    )
    
    # Store answer
    session["answers"].append({
        "question_id": request.question_id,
        "answer": request.answer_text,
        "feedback": feedback
    })
    
    # Get next question
    next_index = session["current_question_index"] + 1
    next_question = None
    
    if next_index < len(mock_questions):
        next_question = mock_questions[next_index]
        session["current_question_index"] = next_index
    
    return {
        "feedback": feedback,
        "next_question": next_question
    }

@router.get("/mock/session/{session_id}")
async def get_session(session_id: str):
    """Get interview session details"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return active_sessions[session_id]
