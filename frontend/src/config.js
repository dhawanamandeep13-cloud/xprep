// FIX: Use environment variable in production, fallback to localhost for development
// In your Render dashboard, set REACT_APP_API_URL = https://xprep-1.onrender.com/api
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://xprep-1.onrender.com/api";