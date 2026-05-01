import { API_BASE_URL } from "../config";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = Array.isArray(data.detail)
        ? data.detail.map((item) => item.msg || JSON.stringify(item)).join("; ")
        : data.detail;
      throw new Error(detail || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

const APIService = {
  // ─── INTERVIEW ───────────────────────────────────────────────
  startMockInterview(interviewType, role = "General") {
    return request("/interview/mock/start", {
      method: "POST",
      body: JSON.stringify({
        interview_type: interviewType,
        role,
      }),
    });
  },

  submitAnswer(sessionId, questionId, answer) {
    return request("/interview/mock/answer", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer_text: answer,
      }),
    });
  },

  getSession(sessionId) {
    return request(`/interview/mock/session/${sessionId}`);
  },
async enhanceCV(payload) {
  const res = await fetch("/api/enhance-cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async compareCVJD(cvText, jdText) {
  const res = await fetch("/api/cv-vs-jd", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ cvText, jdText })
  });
  return res.json();
}

async createOrder() {
  const res = await fetch("/api/create-order", { method: "POST" });
  return res.json();
}
  // ─── RESUME ──────────────────────────────────────────────────
  generateResumeSuggestions(section, currentText, role, experienceYears) {
    return request("/resume/generate-suggestions", {
      method: "POST",
      body: JSON.stringify({
        section,
        current_text: currentText,
        role,
        experience_years: experienceYears,
      }),
    });
  },

  analyzeATS(resumeContent, targetRole) {
    return request("/resume/analyze-ats", {
      method: "POST",
      body: JSON.stringify({
        resume_content: { text: resumeContent },
        target_role: targetRole,
      }),
    });
  },

  // ─── JOBS ─────────────────────────────────────────────────────
  searchJobs(preferences, resumeData = {}) {
    return request("/jobs/search", {
      method: "POST",
      body: JSON.stringify({
        preferences,
        resume_data: resumeData,
      }),
    });
  },
};

export default APIService;
