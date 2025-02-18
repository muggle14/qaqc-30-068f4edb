
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with common configuration
export const chatSummaryApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Add request interceptor for logging
chatSummaryApi.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
chatSummaryApi.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

// Test data - only used in development/testing environments
const TEST_SUMMARY = {
  short_summary: "Test summary of the conversation",
  detailed_bullet_summary: [
    "Customer contacted regarding account inquiry",
    "Discussed payment options",
    "Resolved primary concerns"
  ]
};

const TEST_VC_ASSESSMENT = {
  complaint: false,
  complaint_reason: "No complaints identified in conversation",
  financial_vulnerability: true,
  vulnerability_reason: "Customer expressed financial difficulties",
  complaint_snippet: "",
  vulnerability_snippet: "Customer mentioned payment difficulties"
};

export const getSummary = async (conversation: string) => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  // Only use test data if explicitly in test mode
  if (import.meta.env.MODE === 'test') {
    console.log("Test mode: Using test summary data");
    return TEST_SUMMARY;
  }

  console.log("Calling getSummary with conversation:", conversation.substring(0, 100) + "...");
  
  const response = await chatSummaryApi.post("/chat-summary", {
    conversation,
  });
  
  return {
    short_summary: response.data.short_summary || "",
    detailed_bullet_summary: Array.isArray(response.data.detailed_bullet_summary) 
      ? response.data.detailed_bullet_summary 
      : []
  };
};

export const getVAndCAssessment = async (conversation: string) => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  // Only use test data if explicitly in test mode
  if (import.meta.env.MODE === 'test') {
    console.log("Test mode: Using test V&C assessment data");
    return TEST_VC_ASSESSMENT;
  }

  console.log("Calling getVAndCAssessment with conversation:", conversation.substring(0, 100) + "...");
  
  const response = await chatSummaryApi.post("/vAndCAssessment", {
    conversation,
  });
  
  return {
    complaint: response.data.complaint || false,
    complaint_reason: response.data.complaint_reason || "",
    financial_vulnerability: response.data.financial_vulnerability || false,
    vulnerability_reason: response.data.vulnerability_reason || "",
    complaint_snippet: response.data.complaint_snippet || "",
    vulnerability_snippet: response.data.vulnerability_snippet || ""
  };
};
