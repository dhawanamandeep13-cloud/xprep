# Xprep AI Platform - Backend Integration Contracts

## Overview
This document outlines the API contracts, mock data replacement strategy, and backend implementation approach for the Xprep AI career intelligence platform.

## Frontend-Backend Integration Strategy

### Phase 1: Current State (MOCK DATA)
All AI features currently use mock data in `/app/frontend/src/mockData.js`:
- Education modules with progress
- AI tools descriptions
- Mock interview questions
- Job listings
- Testimonials
- Statistics

### Phase 2: Backend Implementation (WITH OPENAI API)

## API Endpoints

### 1. AI Mock Interview

#### POST `/api/interview/mock/start`
**Purpose:** Start a new mock interview session
**Request:**
```json
{
  "interview_type": "behavioral|technical|case|general",
  "role": "Software Engineer",
  "experience_level": "mid"
}
```
**Response:**
```json
{
  "session_id": "uuid",
  "question": {
    "id": 1,
    "text": "Tell me about yourself",
    "category": "Behavioral",
    "difficulty": "Easy"
  }
}
```

#### POST `/api/interview/mock/answer`
**Purpose:** Submit answer and get AI feedback
**Request:**
```json
{
  "session_id": "uuid",
  "question_id": 1,
  "answer_text": "user's answer...",
  "audio_duration_seconds": 120
}
```
**Response:**
```json
{
  "feedback": {
    "score": 85,
    "strengths": ["Clear communication", "Good STAR method"],
    "improvements": ["Add metrics", "Expand on impact"],
    "suggestion": "Consider adding...",
    "next_question": {...}
  }
}
```

### 2. AI Resume Builder

#### POST `/api/resume/generate-suggestions`
**Purpose:** Get AI-powered resume suggestions
**Request:**
```json
{
  "section": "summary|experience|skills",
  "current_text": "existing content...",
  "role": "Software Engineer",
  "experience_years": 5
}
```
**Response:**
```json
{
  "suggestions": {
    "improved_text": "AI-generated content...",
    "keywords": ["Python", "React", "AWS"],
    "ats_tips": ["Add metrics", "Use action verbs"]
  }
}
```

#### POST `/api/resume/analyze-ats`
**Purpose:** Analyze ATS compatibility
**Request:**
```json
{
  "resume_content": {
    "summary": "...",
    "experience": "...",
    "skills": "..."
  },
  "target_role": "Software Engineer"
}
```
**Response:**
```json
{
  "ats_score": 85,
  "missing_keywords": ["Docker", "Kubernetes"],
  "improvements": ["Add quantifiable achievements"],
  "formatted_sections": {...}
}
```

### 3. AI Job Hunter

#### POST `/api/jobs/search`
**Purpose:** Search and match jobs with AI
**Request:**
```json
{
  "preferences": {
    "role": "Software Engineer",
    "location": "Bangalore",
    "experience_level": "mid",
    "job_type": "full-time"
  },
  "resume_data": {...}
}
```
**Response:**
```json
{
  "jobs": [
    {
      "id": "job_123",
      "title": "Senior Software Engineer",
      "company": "Google",
      "match_score": 95,
      "match_reasons": ["Skills align", "Experience matches"],
      "location": "Bangalore",
      "salary": "₹30-45 LPA"
    }
  ]
}
```

### 4. Interview Questions Bank

#### GET `/api/questions/search`
**Purpose:** Search interview questions
**Query Params:** `?category=behavioral&difficulty=medium&company=google`
**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "Tell me about yourself",
      "category": "Behavioral",
      "difficulty": "Easy",
      "companies": ["Google", "Amazon"],
      "sample_answer": "...",
      "tips": ["Use STAR method"]
    }
  ],
  "total": 2500
}
```

## Database Schema

### Collections

#### `interview_sessions`
```javascript
{
  _id: ObjectId,
  user_id: String,
  session_type: String,
  questions: Array,
  answers: Array,
  feedback: Array,
  created_at: DateTime,
  updated_at: DateTime
}
```

#### `resumes`
```javascript
{
  _id: ObjectId,
  user_id: String,
  personal_info: Object,
  summary: String,
  experience: Array,
  education: Array,
  skills: Array,
  template: String,
  ats_score: Number,
  created_at: DateTime
}
```

#### `job_applications`
```javascript
{
  _id: ObjectId,
  user_id: String,
  job_id: String,
  job_details: Object,
  application_status: String,
  applied_at: DateTime,
  match_score: Number
}
```

#### `interview_questions`
```javascript
{
  _id: ObjectId,
  question: String,
  category: String,
  difficulty: String,
  companies: Array,
  sample_answer: String,
  tips: Array,
  created_at: DateTime
}
```

## Mock Data Replacement Plan

### Files to Update:
1. `/app/frontend/src/mockData.js` - Remove mock responses, keep initial display data
2. Create `/app/frontend/src/services/api.js` - API service layer
3. Update page components to call real APIs:
   - `MockInterview.js` - Connect to interview APIs
   - `ResumeBuilder.js` - Connect to resume APIs
   - `JobHunter.js` - Connect to job search APIs
   - `QuestionsBank.js` - Connect to questions APIs

## OpenAI Integration

### API Key Storage:
- Backend `.env`: `OPENAI_API_KEY=sk-...`
- Model: `gpt-4` or `gpt-5.2` (as specified by user)
- Temperature: 0.7 for creative responses
- Max tokens: 500-1000 depending on use case

### AI Prompt Templates:

**Mock Interview Feedback:**
```
You are an expert interview coach. Analyze this interview answer and provide constructive feedback.

Question: {question}
Answer: {answer}

Provide feedback in JSON format with:
- score (0-100)
- strengths (array of 2-3 points)
- improvements (array of 2-3 points)
- suggestion (one paragraph)
```

**Resume Improvement:**
```
You are a professional resume writer. Improve this resume section for ATS optimization.

Section: {section_name}
Current text: {current_text}
Target role: {role}

Provide improved text that is:
- ATS-friendly with relevant keywords
- Quantifiable and impact-focused
- Professional and concise
```

## Implementation Priority:
1. ✅ Frontend with mock data (COMPLETED)
2. 🔄 Backend API setup with OpenAI
3. 🔄 Database models
4. 🔄 Frontend-backend integration
5. 🔄 Testing and refinement
