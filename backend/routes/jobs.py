import os
from typing import Any, Dict, List
from urllib.parse import quote_plus

import httpx
from fastapi import APIRouter, HTTPException
from models import JobSearchRequest

router = APIRouter(prefix="/jobs", tags=["jobs"])

ADZUNA_COUNTRY_CODES = {
    "India": "in",
    "United Arab Emirates": "ae",
    "Singapore": "sg",
    "United Kingdom": "gb",
    "United States": "us",
}


def build_search_links(preferences: Dict[str, Any]) -> List[Dict[str, str]]:
    role = preferences["role"].strip()
    location = preferences.get("location", "India").strip() or "India"
    skills = " ".join(preferences.get("skills", [])[:5])
    query = " ".join(part for part in (role, skills, preferences.get("industry", ""), preferences.get("domain", "")) if part).strip()
    encoded_query = quote_plus(query)
    encoded_location = quote_plus(location)
    slug_query = "-".join(query.lower().split())
    slug_location = "-".join(location.lower().split())
    linkedin_filters = "&f_WT=2" if preferences.get("work_mode") == "remote" else ""
    country = preferences.get("country", "India")
    indeed_base = "https://in.indeed.com" if country == "India" else "https://www.indeed.com"

    links = [
        {
            "name": "LinkedIn Jobs",
            "url": f"https://www.linkedin.com/jobs/search/?keywords={encoded_query}&location={encoded_location}&f_TPR=r604800&sortBy=DD{linkedin_filters}",
            "description": "Recent opportunities, filtered for the last seven days."
        },
        {
            "name": "Indeed India",
            "url": f"{indeed_base}/jobs?q={encoded_query}&l={encoded_location}&fromage=7&sort=date",
            "description": f"Recent jobs matching your role and skills in {country}."
        },
    ]
    if country == "India":
        links.extend([
            {
            "name": "Naukri",
            "url": f"https://www.naukri.com/{slug_query}-jobs-in-{slug_location}",
            "description": "Search the leading India-focused job board."
            },
            {
            "name": "foundit",
            "url": f"https://www.foundit.in/search/{encoded_query}-jobs-in-{encoded_location}",
            "description": "Explore India roles and refine with foundit's filters."
            },
        ])
    return links


def format_salary(job: Dict[str, Any]) -> str:
    minimum = job.get("salary_min")
    maximum = job.get("salary_max")
    if minimum and maximum:
        return f"₹{minimum:,.0f} – ₹{maximum:,.0f} per year"
    if minimum:
        return f"From ₹{minimum:,.0f} per year"
    return "Salary not disclosed"


def score_job(job: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    searchable = f"{job.get('title', '')} {job.get('description', '')}".lower()
    role_terms = [term for term in preferences["role"].lower().split() if len(term) > 2]
    skills = [skill.lower() for skill in preferences.get("skills", []) if skill.strip()]
    industry_terms = [term.lower() for term in (preferences.get("industry", ""), preferences.get("domain", "")) if term]
    role_matches = [term for term in role_terms if term in searchable]
    skill_matches = [skill for skill in skills if skill in searchable]
    score = min(95, 45 + len(role_matches) * 12 + len(skill_matches) * 8)
    reasons = []
    if role_matches:
        reasons.append(f"Matches your target role: {', '.join(role_matches[:3])}")
    if skill_matches:
        reasons.append(f"Mentions your skills: {', '.join(skill_matches[:3])}")
    industry_matches = [term for term in industry_terms if term in searchable]
    if industry_matches:
        score = min(98, score + len(industry_matches) * 4)
        reasons.append(f"Aligns with your focus: {', '.join(industry_matches[:2])}")
    if preferences.get("location", "").lower() in str(job.get("location", "")).lower():
        score = min(98, score + 5)
        reasons.append("Matches your preferred location")
    if not reasons:
        reasons.append("Matches your selected search criteria")
    return {"match_score": score, "match_reasons": reasons}


async def fetch_adzuna_india_jobs(preferences: Dict[str, Any], page: int, page_size: int) -> Dict[str, Any]:
    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    if not app_id or not app_key:
        return {"jobs": [], "total_results": 0}

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": " ".join([preferences["role"], *preferences.get("skills", [])[:5], preferences.get("industry", ""), preferences.get("domain", "")]).strip(),
        "where": preferences.get("location", "India"),
        "results_per_page": page_size,
        "sort_by": "date",
    }
    if preferences.get("job_type") == "full-time":
        params["full_time"] = 1
    elif preferences.get("job_type") == "contract":
        params["contract"] = 1
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            country_code = ADZUNA_COUNTRY_CODES.get(preferences.get("country", "India"), "in")
            response = await client.get(f"https://api.adzuna.com/v1/api/jobs/{country_code}/search/{page}", params=params)
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError):
        return {"jobs": [], "total_results": 0}

    jobs = []
    for item in payload.get("results", []):
        ranking = score_job(item, preferences)
        jobs.append({
            "id": str(item.get("id", "")),
            "title": item.get("title", "Untitled role"),
            "company": item.get("company", {}).get("display_name", "Company not disclosed"),
            "location": item.get("location", {}).get("display_name", preferences.get("location", "India")),
            "salary": format_salary(item),
            "job_type": item.get("contract_type") or "Not specified",
            "posted": item.get("created", "Recently posted"),
            "apply_url": item.get("redirect_url", ""),
            "description": item.get("description", "")[:3000],
            "source": "Adzuna India",
            **ranking,
        })
    return {
        "jobs": sorted(jobs, key=lambda job: job["match_score"], reverse=True),
        "total_results": int(payload.get("count", 0)),
    }


@router.post("/search")
async def search_jobs(request: JobSearchRequest):
    """Find India-focused job opportunities without fabricating listings."""
    preferences_dict = request.preferences.dict()
    if not preferences_dict["role"].strip():
        raise HTTPException(status_code=422, detail="Please enter a target role")

    search_result = await fetch_adzuna_india_jobs(preferences_dict, request.page, request.page_size)
    jobs = search_result["jobs"]
    total_results = search_result["total_results"]
    return {
        "jobs": jobs,
        "search_links": build_search_links(preferences_dict),
        "live_results": bool(jobs),
        "page": request.page,
        "page_size": request.page_size,
        "total_results": total_results,
        "has_more": bool(jobs) and request.page * request.page_size < total_results,
        "message": (
            "Live India jobs are ranked using your role, skills, and location."
            if jobs else
            "Open the India job boards below for live results. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to enable verified live listings inside Xprep."
        ),
    }
