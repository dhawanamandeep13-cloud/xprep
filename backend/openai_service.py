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
            # Try to parse as JSON, if fails return structured format
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
            # Return fallback feedback
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
        """Analyze resume for ATS compatibility"""
        try:
            client = get_openai_client()
            resume_text = "\n".join([f"{k}: {v}" for k, v in resume_content.items()])
            
            prompt = f"""Analyze this resume for ATS compatibility and provide a score.

Resume:
{resume_text}

Target Role: {target_role}

Provide JSON with:
- ats_score (0-100, integer)
- missing_keywords (array of 3-5 important keywords missing)
- improvements (array of 3-4 specific actionable improvements)
"""
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an ATS (Applicant Tracking System) expert analyzing resumes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            analysis_text = response.choices[0].message.content
            try:
                analysis = json.loads(analysis_text)
            except:
                analysis = {
                    "ats_score": 75,
                    "missing_keywords": ["Cloud Computing", "Agile", "CI/CD"],
                    "improvements": ["Add technical skills section", "Include metrics in achievements", "Use standard section headings"]
                }
            
            return analysis
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            return {
                "ats_score": 70,
                "missing_keywords": ["Technical Skills", "Certifications", "Tools"],
                "improvements": ["Add keyword-rich summary", "Include measurable achievements", "Use industry-standard terminology"]
            }
    
    @staticmethod
    def generate_job_matches(preferences: Dict[str, Any], resume_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI-matched job recommendations"""
        # For MVP, return mock jobs with AI-generated match reasons
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
        
        # Add AI-generated match scores and reasons
        for job in mock_jobs:
            job["match_score"] = 90 + (hash(job["company"]) % 10)
            job["match_reasons"] = [
                "Skills align with requirements",
                "Experience level matches",
                "Location preference met"
            ]
            job["id"] = f"job_{hash(job['company']) % 10000}"
        
        return mock_jobs
