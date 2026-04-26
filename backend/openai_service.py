import os
import json
import httpx
from typing import Dict, List, Any

# ✅ Stable Gemini model
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash-lite")
GEMINI_API_VERSION = os.environ.get("GEMINI_API_VERSION", "v1beta")
GEMINI_API_URL = (
    f"https://generativelanguage.googleapis.com/{GEMINI_API_VERSION}"
    f"/models/{GEMINI_MODEL}:generateContent"
)


# ✅ Shared HTTP client (better performance on Render)
client = httpx.Client(timeout=60.0)


def extract_json(text: str):
    """
    Safely extract JSON from Gemini response
    """
    text = text.strip()

    if "```" in text:
        text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("{")
    end = text.rfind("}") + 1

    if start == -1 or end == -1:
        raise ValueError(f"❌ No JSON found in response: {text}")

    return json.loads(text[start:end])


def extract_json_array(text: str):
    """
    Extract JSON array safely
    """
    text = text.strip()

    if "```" in text:
        text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("[")
    end = text.rfind("]") + 1

    if start == -1 or end == -1:
        raise ValueError(f"❌ No JSON array found in response: {text}")

    return json.loads(text[start:end])


def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("❌ GEMINI_API_KEY not found in environment variables")

    url = f"{GEMINI_API_URL}?key={api_key}"

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1200
        }
    }

    print("🚀 Calling Gemini API...")

    try:
        response = client.post(url, json=payload)

        print("📡 Status:", response.status_code)

        if response.status_code != 200:
            print("❌ Error Response:", response.text)
            raise Exception(f"Gemini API failed: {response.text}")

        data = response.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"]

        print("🧠 RAW OUTPUT:", text[:500])  # avoid huge logs

        return text

    except Exception as e:
        print("❌ Gemini API Call Failed:", str(e))
        raise


class OpenAIService:

    @staticmethod
    def generate_interview_feedback(question: str, answer: str) -> Dict[str, Any]:

        prompt = f"""
You are an expert interview coach.

Question: {question}
Answer: {answer}

Return ONLY JSON:
{{
  "score": number,
  "strengths": [string],
  "improvements": [string],
  "suggestion": string
}}
"""

        text = call_gemini(prompt)
        return extract_json(text)

    @staticmethod
    def generate_resume_suggestions(
        section: str,
        current_text: str,
        role: str,
        experience_years: int
    ) -> Dict[str, Any]:

        prompt = f"""
You are a professional resume writer.

Section: {section}
Current text: {current_text}
Target role: {role}
Experience: {experience_years}

Return ONLY JSON:
{{
  "improved_text": string,
  "keywords": [string],
  "tips": [string]
}}
"""

        text = call_gemini(prompt)
        return extract_json(text)

    @staticmethod
    def analyze_ats_compatibility(
        resume_content: Dict[str, str],
        target_role: str
    ) -> Dict[str, Any]:

        resume_text = "\n".join(
            [f"{k}: {v}" for k, v in resume_content.items()]
        )

        prompt = f"""
You are an ATS expert.

Analyze this resume for role: {target_role}

Resume:
{resume_text}

Return ONLY JSON:
{{
  "ats_score": number,
  "matched_keywords": [string],
  "missing_keywords": [string],
  "strengths": [string],
  "improvements": [string],
  "section_scores": {{
    "summary": number,
    "experience": number,
    "skills": number,
    "education": number
  }},
  "recommendations": [string]
}}
"""

        text = call_gemini(prompt)
        return extract_json(text)

    @staticmethod
    def generate_job_matches(
        preferences: Dict[str, Any],
        resume_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:

        prompt = f"""
You are a job matching AI.

Suggest 5 relevant jobs.

Return ONLY JSON ARRAY:
[
  {{
    "title": string,
    "company": string,
    "location": string,
    "match_score": number,
    "match_reasons": [string]
  }}
]

Candidate:
{json.dumps(resume_data)}

Preferences:
{json.dumps(preferences)}
"""

        text = call_gemini(prompt)
        return extract_json_array(text)
