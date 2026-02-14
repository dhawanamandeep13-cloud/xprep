import { API_BASE_URL } from "../config";

const APIService = {
  async startMockInterview(interviewType) {
    const response = await fetch(`${API_BASE_URL}/interview/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interview_type: interviewType }),
    });

    if (!response.ok) {
      throw new Error("Failed to start interview");
    }

    return response.json();
  },

  async submitAnswer(sessionId, questionId, answer) {
    const response = await fetch(`${API_BASE_URL}/interview/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer: answer,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit answer");
    }

    return response.json();
  },
};

export default APIService;
