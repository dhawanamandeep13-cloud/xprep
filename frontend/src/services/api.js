import { API_BASE_URL } from "../config";

const APIService = {
  // ─── INTERVIEW ───────────────────────────────────────────────
  async startMockInterview(interviewType, role = "General") {
    // FIX: correct route is /interview/mock/start (was /interview/start)
    const response = await fetch(`${API_BASE_URL}/interview/mock/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // FIX: added required 'role' field (was missing)
      body: JSON.stringify({ interview_type: interviewType, role }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to start interview");
    }

    return response.json();
  },

  async submitAnswer(sessionId, questionId, answer) {
    // FIX: correct route is /interview/mock/answer (was /interview/answer)
    const response = await fetch(`${API_BASE_URL}/interview/mock/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer_text: answer, // FIX: was 'answer', backend expects 'answer_text'
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to submit answer");
    }

    return response.json();
  },

  async getSession(sessionId) {
    const response = await fetch(
      `${API_BASE_URL}/interview/mock/session/${sessionId}`
    );

    if (!response.ok) {
      throw new Error("Session not found");
    }

    return response.json();
  },

  // ─── RESUME ──────────────────────────────────────────────────
  async generateResumeSuggestions(section, currentText, role, experienceYears) {
    const response = await fetch(`${API_BASE_URL}/resume/generate-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        current_text: currentText,
        role,
        experience_years: experienceYears,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to generate suggestions");
    }

    return response.json();
  },

  async analyzeATS(resumeContent, targetRole) {
    const response = await fetch(`${API_BASE_URL}/resume/analyze-ats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_content: { text: resumeContent },
        target_role: targetRole,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to analyze ATS");
    }

    return response.json();
  },

  // ─── JOBS ─────────────────────────────────────────────────────
  async searchJobs(preferences, resumeData = {}) {
    const response = await fetch(`${API_BASE_URL}/jobs/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences,
        resume_data: resumeData,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to search jobs");
    }

    return response.json();
  },
};

export default APIService;
