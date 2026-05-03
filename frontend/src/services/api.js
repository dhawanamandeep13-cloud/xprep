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

async function uploadFile(endpoint, file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
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
    console.error("Upload Error:", error.message);
    throw error;
  }
}

const APIService = {
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

  extractResumeText(file) {
    return uploadFile("/resume/extract-text", file);
  },

  compareCVJD(cvText, jdText) {
    return request("/resume/cv-vs-jd", {
      method: "POST",
      body: JSON.stringify({
        cv_text: cvText,
        jd_text: jdText,
      }),
    });
  },

  enhanceCV(payload) {
    return request("/resume/enhance-cv", {
      method: "POST",
      body: JSON.stringify({
        cv_text: payload.cvText,
        jd_text: payload.jdText || "",
        missing_keywords: payload.missingKeywords || [],
        recommendations: payload.recommendations || [],
      }),
    });
  },

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
