import os
import json
import httpx
from typing import Dict, List, Any

# Updated Gemini model
GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateContent"


def call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 1000
        }
    }

    try:
        response = httpx.post(
            f"{GEMINI_API_URL}?key={api_key}",
            json=payload,
            timeout=60.0
        )

        print("Gemini Status Code:", response.status_code)
        print("Gemini Raw Response:", response.text)

        response.raise_for_status()

        data = response.json()

        if "candidates" not in data:
            raise Exception(f"Invalid Gemini response: {data}")

        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

        # Remove markdown wrappers if any
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        return text

    except Exception as e:
        print(f"Gemini API Call Failed: {str(e)}")
        raise


class OpenAIService:

    @staticmethod
    def generate_interview_feedback(question: str, answer: str) -> Dict[str, Any]:
        try:
            prompt = f"""
You are an expert interview coach. Analyze this interview answer.

Question: {question}
Answer: {answer}

Respond ONLY in JSON:
{{
  "score": 85,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "suggestion": "Detailed suggestion here"
}}
"""

            text = call_gemini(prompt)
            return json.loads(text)

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "score": 70,
                "strengths": ["Answer provided"],
                "improvements": ["Add more detail"],
                "suggestion": "Consider using STAR format."
            }

    @staticmethod
    def generate_resume_suggestions(section: str, current_text: str, role: str, experience_years: int) -> Dict[str, Any]:
        try:
            prompt = f"""
You are a professional resume writer.

Section: {section}
Current text: {current_text}
Target role: {role}
Experience: {experience_years}

Respond ONLY in JSON:
{{
  "improved_text": "Improved ATS optimized text",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "tips": ["tip1", "tip2", "tip3"]
}}
"""

            text = call_gemini(prompt)
            return json.loads(text)

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "improved_text": current_text,
                "keywords": [],
                "tips": ["Add measurable achievements"]
            }

    @staticmethod
    def analyze_ats_compatibility(resume_content: Dict[str, str], target_role: str) -> Dict[str, Any]:
        try:
            resume_text = "\n".join(
                [f"{key}: {value}" for key, value in resume_content.items()]
            )

            prompt = f"""
You are an ATS expert.

Analyze this resume for role: {target_role}

Resume:
{resume_text}

Respond ONLY in JSON:
{{
  "ats_score": 85,
  "matched_keywords": ["Finance", "Leadership"],
  "missing_keywords": ["SAP", "Compliance"],
  "strengths": ["Strong summary", "Relevant experience"],
  "improvements": ["Add more metrics", "Include certifications"],
  "section_scores": {{
    "summary": 80,
    "experience": 85,
    "skills": 75,
    "education": 90
  }},
  "recommendations": [
    "Tailor summary to role",
    "Add measurable results",
    "Add role-specific tools",
    "Improve ATS keywords"
  ]
}}
"""

            text = call_gemini(prompt)
            return json.loads(text)

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "ats_score": 70,
                "matched_keywords": [],
                "missing_keywords": ["Technical Skills", "Certifications"],
                "strengths": ["Resume processed successfully"],
                "improvements": ["Add role-specific keywords"],
                "section_scores": {
                    "summary": 65,
                    "experience": 70,
                    "skills": 60,
                    "education": 75
                },
                "recommendations": [
                    "Tailor resume for target role",
                    "Add quantifiable achievements",
                    "Add tools section",
                    "Improve keyword density"
                ]
            }

    @staticmethod
    def generate_job_matches(preferences: Dict[str, Any], resume_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        mock_jobs = [
            {
                "title": "Senior Software Engineer",
                "company": "Google",
                "location": preferences.get("location", "Bangalore"),
                "salary": "30-45 LPA",
                "job_type": "Full-time",
                "posted": "2 days ago"
            },
            {
                "title": "Product Manager",
                "company": "Microsoft",
                "location": "Hyderabad",
                "salary": "25-40 LPA",
                "job_type": "Full-time",
                "posted": "1 week ago"
            }
        ]

        for job in mock_jobs:
            job["match_score"] = 90
            job["match_reasons"] = [
                "Skills align well",
                "Experience matches role"
            ]
            job["id"] = f"job_{hash(job['company']) % 10000}"

        return mock_jobs