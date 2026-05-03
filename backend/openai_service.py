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

    if start == -1 or end <= start:
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

    if start == -1 or end <= start:
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
            "temperature": 0.2,
            "maxOutputTokens": 3000,
            "response_mime_type": "application/json"
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


def fallback_ats_analysis(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Deterministic fallback used when Gemini returns invalid JSON or fails.
    Keeps the ATS tool usable while logs still show the Gemini issue.
    """
    text_lower = resume_text.lower()
    role_lower = target_role.lower()
    role_terms = [
        term for term in role_lower.replace("/", " ").replace("-", " ").split()
        if len(term) > 2
    ]
    common_terms = [
        "leadership", "strategy", "finance", "financial", "reporting", "budget",
        "forecasting", "audit", "risk", "compliance", "controls", "governance",
        "stakeholder", "team", "process", "analysis", "planning", "operations",
        "tax", "treasury", "cash", "sap", "excel", "ifrs", "gaap"
    ]
    keywords = list(dict.fromkeys(role_terms + common_terms))
    matched = [keyword for keyword in keywords if keyword in text_lower]
    missing = [keyword for keyword in keywords if keyword not in text_lower][:10]

    length_score = 20 if len(resume_text) > 2500 else 14 if len(resume_text) > 1000 else 8
    keyword_score = min(45, len(matched) * 4)
    structure_score = sum(
        5 for section in ["experience", "education", "skills", "summary", "achievement"]
        if section in text_lower
    )
    ats_score = max(35, min(85, length_score + keyword_score + structure_score))

    return {
        "ats_score": ats_score,
        "matched_keywords": matched[:12],
        "missing_keywords": missing,
        "strengths": [
            "Resume content was received and analyzed successfully.",
            "Several role-relevant keywords were identified." if matched else "The resume has usable content for ATS review."
        ],
        "improvements": [
            "Add more exact keywords from the target role.",
            "Use clear section headings such as Summary, Experience, Skills, and Education.",
            "Quantify achievements with metrics, scale, savings, revenue, risk reduction, or team size."
        ],
        "section_scores": {
            "summary": 70 if "summary" in text_lower else 50,
            "experience": 75 if "experience" in text_lower else 55,
            "skills": 75 if "skills" in text_lower else 50,
            "education": 70 if "education" in text_lower else 50
        },
        "recommendations": [
            f"Mirror more language from {target_role} job descriptions.",
            "Place the most important finance leadership keywords in the top third of the resume.",
            "Rewrite bullets to start with action verbs and include measurable business impact."
        ]
    }


def fallback_cv_jd_analysis(cv_text: str, jd_text: str) -> Dict[str, Any]:
    cv_lower = cv_text.lower()
    jd_words = [
        word.strip(".,:;()[]{}").lower()
        for word in jd_text.replace("/", " ").replace("-", " ").split()
    ]
    stop_words = {
        "and", "the", "for", "with", "you", "your", "are", "will", "this",
        "that", "from", "have", "has", "our", "their", "role", "job", "work"
    }
    jd_keywords = [
        word for word in jd_words
        if len(word) > 3 and word not in stop_words and not word.isdigit()
    ]
    jd_keywords = list(dict.fromkeys(jd_keywords))[:35]
    matched = [word for word in jd_keywords if word in cv_lower]
    missing = [word for word in jd_keywords if word not in cv_lower][:15]
    score = int((len(matched) / max(len(jd_keywords), 1)) * 100)
    score = max(35, min(90, score))

    return {
        "ats_score": score,
        "matched_keywords": matched[:15],
        "missing_keywords": missing,
        "strengths": [
            "The CV contains several relevant terms from the job description." if matched else "The CV has readable content for comparison.",
            "The comparison was completed against the provided job description."
        ],
        "improvements": [
            "Add the missing role-specific keywords naturally into the summary, skills, and experience sections.",
            "Rewrite experience bullets to mirror the job description's responsibilities and required outcomes.",
            "Quantify achievements with numbers, scale, savings, risk reduction, revenue, or team size."
        ],
        "section_scores": {
            "summary": 70 if "summary" in cv_lower else 50,
            "experience": 75 if "experience" in cv_lower else 55,
            "skills": 75 if "skills" in cv_lower else 50,
            "education": 65 if "education" in cv_lower else 50
        },
        "recommendations": [
            "Put the most important JD keywords in the top third of the CV.",
            "Add a short target-role summary aligned to the job description.",
            "Prioritize recent, measurable achievements that map to the JD requirements."
        ],
        "missing_cv_points": missing,
        "rewrite_suggestions": [
            "Convert generic responsibilities into achievement-led bullets.",
            "Use exact terminology from the JD where it accurately reflects your experience.",
            "Group technical and domain skills into a clear Skills section."
        ]
    }


def fallback_enhanced_cv(cv_text: str, missing_keywords: List[str], recommendations: List[str]) -> Dict[str, str]:
    keyword_line = ", ".join(missing_keywords[:12]) if missing_keywords else "role-relevant keywords"
    recommendation_lines = "\n".join(f"- {item}" for item in recommendations[:5])
    enhanced_cv = f"""{cv_text.strip()}

Targeted ATS Enhancement Notes
Keywords to weave in naturally: {keyword_line}

Recommended CV changes:
{recommendation_lines or "- Add quantified achievements and align language to the target job description."}
"""
    return {"enhanced_cv": enhanced_cv}


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

        try:
            text = call_gemini(prompt)
            return extract_json(text)
        except Exception as e:
            print("⚠️ Falling back to deterministic ATS analysis:", str(e))
            return fallback_ats_analysis(resume_text, target_role)

    @staticmethod
    def compare_cv_to_jd(cv_text: str, jd_text: str) -> Dict[str, Any]:
        prompt = f"""
You are an ATS and recruitment screening expert.

Compare this CV against this job description. Identify alignment gaps and concrete CV rewrite guidance.

CV:
{cv_text}

Job Description:
{jd_text}

Return ONLY JSON:
{{
  "ats_score": number,
  "matched_keywords": [string],
  "missing_keywords": [string],
  "missing_cv_points": [string],
  "strengths": [string],
  "improvements": [string],
  "rewrite_suggestions": [string],
  "section_scores": {{
    "summary": number,
    "experience": number,
    "skills": number,
    "education": number
  }},
  "recommendations": [string]
}}
"""
        try:
            text = call_gemini(prompt)
            return extract_json(text)
        except Exception as e:
            print("⚠️ Falling back to deterministic CV vs JD analysis:", str(e))
            return fallback_cv_jd_analysis(cv_text, jd_text)

    @staticmethod
    def enhance_cv_for_jd(
        cv_text: str,
        jd_text: str,
        missing_keywords: List[str],
        recommendations: List[str]
    ) -> Dict[str, str]:
        prompt = f"""
You are a senior resume writer.

Rewrite and enhance the CV for the job description while staying truthful to the candidate's original experience.
Add missing keywords only where they fit naturally. Improve summary, skills, and bullets for ATS clarity.

Original CV:
{cv_text}

Job Description:
{jd_text}

Missing keywords to consider:
{json.dumps(missing_keywords)}

Recommendations to address:
{json.dumps(recommendations)}

Return ONLY JSON:
{{
  "enhanced_cv": string
}}
"""
        try:
            text = call_gemini(prompt)
            return extract_json(text)
        except Exception as e:
            print("⚠️ Falling back to deterministic CV enhancement:", str(e))
            return fallback_enhanced_cv(cv_text, missing_keywords, recommendations)

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
