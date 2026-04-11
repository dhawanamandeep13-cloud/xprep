import os
import json
from google import genai
from typing import Dict, List, Any


def get_gemini_client():
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    return genai.Client(api_key=api_key)


def call_gemini(prompt: str) -> str:
    client = get_gemini_client()
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return text.strip()


class OpenAIService:

    @staticmethod
    def generate_interview_feedback(question: str, answer: str) -> Dict[str, Any]:
        try:
            prompt = f"""You are an expert interview coach. Analyze this interview answer and provide constructive feedback.

Question: {question}
Answer: {answer}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{{
  "score": <integer 0-100>,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["actionable suggestion 1", "actionable suggestion 2"],
  "suggestion": "one paragraph of detailed advice"
}}"""

            text = call_gemini(prompt)
            try:
                return json.loads(text)
            except:
                return {
                    "score": 75,
                    "strengths": ["Clear communication", "Relevant examples"],
                    "improvements": ["Add more specific metrics", "Expand on impact"],
                    "suggestion": text
                }

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "score": 70,
                "strengths": ["Answer provided", "Attempted to address the question"],
                "improvements": ["Add more detail", "Include specific examples"],
                "suggestion": "Consider using the STAR method to structure your answer."
            }

    @staticmethod
    def generate_resume_suggestions(section: str, current_text: str, role: str, experience_years: int) -> Dict[str, Any]:
        try:
            prompt = f"""You are a professional resume writer and ATS expert. Improve this resume section.

Section: {section}
Current text: {current_text}
Target role: {role}
Experience: {experience_years} years

Respond ONLY with a valid JSON object, no markdown, no explanation:
{{
  "improved_text": "2-3 sentences, ATS-friendly, quantifiable, impactful",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tips": ["specific tip 1", "specific tip 2", "specific tip 3"]
}}"""

            text = call_gemini(prompt)
            try:
                return json.loads(text)
            except:
                return {
                    "improved_text": text,
                    "keywords": ["Leadership", "Strategy", "Finance", "Analytics", "Compliance"],
                    "tips": ["Add quantifiable achievements", "Use action verbs", "Include relevant technologies"]
                }

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "improved_text": "Results-driven professional with proven track record of delivering high-impact solutions.",
                "keywords": ["Leadership", "Problem-solving", "Innovation", "Collaboration", "Results-oriented"],
                "tips": ["Add specific metrics", "Use strong action verbs", "Highlight key achievements"]
            }

    @staticmethod
    def analyze_ats_compatibility(resume_content: Dict[str, str], target_role: str) -> Dict[str, Any]:
        try:
            resume_text = "\n".join([f"{k}: {v}" for k, v in resume_content.items()])

            prompt = f"""You are an expert ATS analyst and senior HR consultant. Analyze this resume for the role of {target_role}.

Resume:
{resume_text}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{{
  "ats_score": <integer 0-100>,
  "matched_keywords": ["keyword1", "keyword2", "keyword3"],
  "missing_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "strengths": [
    "Specific strength observed in the resume with detail",
    "Another specific strength with context",
    "Third strength if applicable"
  ],
  "improvements": [
    "Specific improvement needed with clear explanation",
    "Another improvement with actionable context",
    "Third improvement area with detail"
  ],
  "section_scores": {{
    "summary": <integer 0-100>,
    "experience": <integer 0-100>,
    "skills": <integer 0-100>,
    "education": <integer 0-100>
  }},
  "recommendations": [
    "Concrete action item 1 specific to {target_role}",
    "Concrete action item 2 specific to {target_role}",
    "Concrete action item 3 specific to {target_role}",
    "Concrete action item 4 specific to {target_role}"
  ]
}}

Be highly specific to the role of {target_role}. Each point must be meaningful and actionable."""

            text = call_gemini(prompt)
            try:
                return json.loads(text)
            except:
                return {
                    "ats_score": 75,
                    "matched_keywords": [],
                    "missing_keywords": ["Technical Skills", "Certifications", "Industry Tools", "Domain Keywords", "Quantified Achievements"],
                    "strengths": [
                        "Resume content was successfully parsed and reviewed",
                        "Professional structure detected in the document"
                    ],
                    "improvements": [
                        "Add more role-specific keywords aligned to " + target_role,
                        "Quantify achievements with numbers, percentages, or rupee values",
                        "Ensure each section has clear headings for ATS parsing"
                    ],
                    "section_scores": {
                        "summary": 70,
                        "experience": 75,
                        "skills": 65,
                        "education": 80
                    },
                    "recommendations": [
                        "Add a dedicated Skills section with tools relevant to " + target_role,
                        "Use bullet points with measurable outcomes in Experience",
                        "Include certifications or training relevant to the role",
                        "Tailor your summary paragraph specifically to " + target_role
                    ]
                }

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return {
                "ats_score": 70,
                "matched_keywords": [],
                "missing_keywords": ["Technical Skills", "Certifications", "Tools", "Domain Expertise", "Leadership"],
                "strengths": [
                    "Resume was submitted and processed",
                    "Content available for ATS evaluation"
                ],
                "improvements": [
                    "Add keyword-rich summary tailored to " + target_role,
                    "Include measurable achievements with specific numbers",
                    "Use industry-standard terminology for " + target_role
                ],
                "section_scores": {
                    "summary": 65,
                    "experience": 70,
                    "skills": 60,
                    "education": 75
                },
                "recommendations": [
                    "Tailor resume specifically for " + target_role,
                    "Add quantifiable results to each experience bullet",
                    "Include a technical skills section with relevant tools",
                    "Ensure consistent formatting for ATS readability"
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
            },
            {
                "title": "Data Scientist",
                "company": "Amazon",
                "location": "Bangalore",
                "salary": "28-42 LPA",
                "job_type": "Full-time",
                "posted": "3 days ago"
            }
        ]

        for job in mock_jobs:
            job["match_score"] = 90 + (hash(job["company"]) % 10)
            job["match_reasons"] = [
                "Skills align with requirements",
                "Experience level matches",
                "Location preference met"
            ]
            job["id"] = f"job_{hash(job['company']) % 10000}"

        return mock_jobs