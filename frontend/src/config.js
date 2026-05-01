// config.js

// Base API URL (uses environment variable if available, otherwise fallback to Render URL)
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://xprep-1.onrender.com/api";

// Optional: helper function for API calls
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};