import uuid
from typing import Dict

from fastapi import APIRouter, HTTPException

from models import InterviewAnswerRequest, InterviewStartRequest
from openai_service import OpenAIService

router = APIRouter(prefix="/interview", tags=["interview"])

# For multi-instance production hosting, move this store to Redis or MongoDB so
# a session survives a service restart and is available on every API instance.
active_sessions: Dict[str, dict] = {}


def with_question_ids(questions: list[dict]) -> list[dict]:
    return [{**question, "id": index + 1} for index, question in enumerate(questions)]


@router.post("/mock/start")
async def start_mock_interview(request: InterviewStartRequest):
    """Start a role-aware AI interview and return the first question."""
    interview_type = request.interview_type.strip().lower()
    if interview_type not in {"behavioral", "technical", "case", "general"}:
        raise HTTPException(status_code=422, detail="Choose behavioral, technical, case, or general interview practice")

    role = (request.role or "General professional").strip()
    experience_level = (request.experience_level or "mid").strip().lower()
    questions = with_question_ids(
        OpenAIService.generate_interview_questions(interview_type, role, experience_level)
    )
    if not questions:
        raise HTTPException(status_code=503, detail="Interview questions could not be prepared. Please try again.")

    session_id = str(uuid.uuid4())
    active_sessions[session_id] = {
        "interview_type": interview_type,
        "role": role,
        "experience_level": experience_level,
        "questions": questions,
        "current_question_index": 0,
        "answers": [],
        "completed": False,
    }
    return {"session_id": session_id, "question": questions[0], "total_questions": len(questions)}


@router.post("/mock/answer")
async def submit_answer(request: InterviewAnswerRequest):
    """Score one answer and prepare the following question, when available."""
    session = active_sessions.get(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Start a new interview to continue.")
    if session["completed"]:
        raise HTTPException(status_code=409, detail="This interview is complete. Start a new session to continue.")

    current_question = session["questions"][session["current_question_index"]]
    if request.question_id != current_question["id"]:
        raise HTTPException(status_code=409, detail="That question has already been answered. Please continue with the current question.")
    if not request.answer_text.strip():
        raise HTTPException(status_code=422, detail="Please provide an answer before requesting feedback")

    feedback = OpenAIService.generate_interview_feedback(
        question=current_question["text"],
        answer=request.answer_text.strip(),
        role=session["role"],
        interview_type=session["interview_type"],
    )
    session["answers"].append({
        "question_id": current_question["id"],
        "answer": request.answer_text.strip(),
        "feedback": feedback,
    })

    next_index = session["current_question_index"] + 1
    next_question = session["questions"][next_index] if next_index < len(session["questions"]) else None
    if next_question:
        session["current_question_index"] = next_index
    else:
        session["completed"] = True

    return {
        "feedback": feedback,
        "next_question": next_question,
        "completed": session["completed"],
        "answered_count": len(session["answers"]),
        "total_questions": len(session["questions"]),
    }


@router.get("/mock/session/{session_id}")
async def get_session(session_id: str):
    session = active_sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
