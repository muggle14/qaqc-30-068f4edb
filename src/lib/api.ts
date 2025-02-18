import axios from "axios";

// Create an axios instance with common configuration
export const chatSummaryApi = axios.create({
  baseURL: "https://chat-summary.azurewebsites.net/api",
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

// Dummy function for getSummary
export const getSummary = async (conversation: string) => {
  // TODO: Implement actual summary functionality
  return {
    short_summary: "This is a placeholder summary",
    detailed_bullet_summary: ["Placeholder bullet point 1", "Placeholder bullet point 2"]
  };
};

// Dummy function for getVAndCAssessment
export const getVAndCAssessment = async (conversation: string) => {
  // TODO: Implement actual V&C assessment functionality
  return {
    complaint: false,
    complaint_reason: "Placeholder complaint reason",
    financial_vulnerability: false,
    vulnerability_reason: "Placeholder vulnerability reason",
    complaint_snippet: "Placeholder complaint snippet",
    vulnerability_snippet: "Placeholder vulnerability snippet"
  };
};
