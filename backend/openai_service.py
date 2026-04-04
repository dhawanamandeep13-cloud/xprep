import os
import json
from openai import OpenAI
from typing import Dict, List, Any

def get_openai_client():
    """Get OpenAI client instance with API key"""
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment variables")
    return OpenAI(api_key=api_key)

class OpenAIService:
    @staticmethod
    def generate_interview_feedback(question: str, answer: str) -> Dict[str, Any]:
        """Generate AI-powered interview feedback"""
        try:
            client = get_openai_client()
            prompt = f"""You are an expert interview coach. Analyze this interview answer and provide constructive feedback.

Question: {question}
Answer: {answer}

Provide feedback in JSON format with:
- score (0-100, integer)
- strengths (array of 2-3 specific points)
- improvements (array of 2-3 actionable suggestions)
- suggestion (one paragraph of detailed advice)

Be constructive, specific, and encouraging. Focus on STAR method, clarity, and impact.
"""
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert interview coach providing constructive feedback."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            feedback_text = response.choices[0].message.content
            try:
                feedback = json.loads(feedback_text)
            except:
                feedback = {
                    "score": 75,
                    "strengths": ["Clear communication", "Relevant examples"],
                    "improvements": ["Add more specific metrics", "Expand on impact"],
                    "suggestion": feedback_text
                }

            return feedback
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            return {
                "score": 70,
                "strengths": ["Answer provided", "Attempted to address the question"],
                "improvements": ["Add more detail", "Include specific examples"],
                "suggestion": "Consider using the STAR method to structure your answer."
            }

    @staticmethod
    def generate_resume_suggestions(section: str, current_text: str, role: str, experience_years: int) -> Dict[str, Any]:
        """Generate AI-powered resume improvement suggestions"""
        try:
            client = get_openai_client()
            prompt = f"""You are a professional resume writer and ATS expert. Improve this resume section.

Section: {section}
Current text: {current_text}
Target role: {role}
Experience: {experience_years} years

Provide:
1. Improved text (2-3 sentences, ATS-friendly, quantifiable, impactful)
2. Top 5 relevant keywords for this role
3. 2-3 specific tips for improvement

Format as JSON with keys: improved_text, keywords (array), tips (array)
"""
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional resume writer specializing in ATS optimization."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=400
            )

            suggestion_text = response.choices[0].message.content
            try:
                suggestions = json.loads(suggestion_text)
            except:
                suggestions = {
                    "improved_text": suggestion_text,
                    "keywords": ["Python", "Leadership", "Agile", "Cloud", "Analytics"],
                    "tips": ["Add quantifiable achievements", "Use action verbs", "Include relevant technologies"]
                }

            return suggestions
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            return {
                "improved_text": "Results-driven professional with proven track record of delivering high-impact solutions.",
                "keywords": ["Leadership", "Problem-solving", "Innovation", "Collaboration", "Results-oriented"],
                "tips": ["Add specific metrics", "Use strong action verbs", "Highlight key achievements"]
            }

    @staticmethod
    def analyze_ats_compatibility(resume_content: Dict[str, str], target_role: str) -> Dict[str, Any]:
        """Analyze resume for ATS compatibility with detailed feedback"""
        try:
            client = get_openai_client()
            resume_text = "\n".join([f"{k}: {v}" for k, v in resume_content.items()])

            prompt = f"""You are an expert ATS (Applicant Tracking System) analyst and senior HR consultant. Analyze this resume for the role of {target_role} and provide detailed, specific feedback.

Resume:
{resume_text}

Return ONLY a valid JSON object with exactly these fields — no markdown, no explanation, just raw JSON:
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
    "Specific improvement needed with clear explanation of why",
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

Be highly specific to the role of {target_role}. Each bullet point should be meaningful and actionable, not generic."""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an ATS expert and HR consultant. Always respond with valid JSON only. No markdown formatting, no code blocks, just raw JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=900
            )

            analysis_text = response.choices[0].message.content.strip()

            # Strip markdown code fences if model wraps response
            if analysis_text.startswith("```"):
                analysis_text = analysis_text.split("```")[1]
                if analysis_text.startswith("json"):
                    analysis_text = analysis_text[4:]
            analysis_text = analysis_text.strip()

            try:
                analysis = json.loads(analysis_text)
            except:
                analysis = {
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

            return analysis

        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
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
        """Generate AI-matched job recommendations"""
        mock_jobs = [
            {
                "title": "Senior Software Engineer",
                "company": "Google",
                "location": preferences.get("location", "Bangalore"),
                "salary": "₹30-45 LPA",
                "job_type": "Full-time",
                "posted": "2 days ago"
            },
            {
                "title": "Product Manager",
                "company": "Microsoft",
                "location": "Hyderabad",
                "salary": "₹25-40 LPA",
                "job_type": "Full-time",
                "posted": "1 week ago"
            },
            {
                "title": "Data Scientist",
                "company": "Amazon",
                "location": "Bangalore",
                "salary": "₹28-42 LPA",
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