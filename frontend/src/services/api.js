import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// API Service class
class APIService {
  // Interview APIs
  static async startMockInterview(interviewType, role = 'Software Engineer', experienceLevel = 'mid') {
    try {
      const response = await axios.post(`${API_BASE}/interview/mock/start`, {
        interview_type: interviewType,
        role,
        experience_level: experienceLevel
      });
      return response.data;
    } catch (error) {
      console.error('Error starting mock interview:', error);
      throw error;
    }
  }

  static async submitAnswer(sessionId, questionId, answerText) {
    try {
      const response = await axios.post(`${API_BASE}/interview/mock/answer`, {
        session_id: sessionId,
        question_id: questionId,
        answer_text: answerText
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  // Resume APIs
  static async generateResumeSuggestions(section, currentText, role = 'Software Engineer', experienceYears = 5) {
    try {
      const response = await axios.post(`${API_BASE}/resume/generate-suggestions`, {
        section,
        current_text: currentText,
        role,
        experience_years: experienceYears
      });
      return response.data;
    } catch (error) {
      console.error('Error generating resume suggestions:', error);
      throw error;
    }
  }

  static async analyzeATS(resumeContent, targetRole) {
    try {
      const response = await axios.post(`${API_BASE}/resume/analyze-ats`, {
        resume_content: resumeContent,
        target_role: targetRole
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing ATS:', error);
      throw error;
    }
  }

  // Job Search APIs
  static async searchJobs(preferences, resumeData = null) {
    try {
      const response = await axios.post(`${API_BASE}/jobs/search`, {
        preferences,
        resume_data: resumeData
      });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }
}

export default APIService;
