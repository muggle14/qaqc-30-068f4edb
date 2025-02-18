
import axios from "axios";

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

interface SummaryResponse {
  short_summary: string;
  detailed_bullet_summary: string[];
}

export const getSummary = async (conversation: string): Promise<SummaryResponse> => {
  const response = await chatSummaryApi.post("/chat-summary", {
    conversation: conversation
  });
  
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  
  return {
    short_summary: response.data.short_summary || "No summary available",
    detailed_bullet_summary: response.data.detailed_bullet_summary || []
  };
};

export const getVAndCAssessment = async (conversation: string) => {
  const response = await chatSummaryApi.post("/contact-assessment", {
    conversation: conversation
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return {
    complaint: response.data.complaint || false,
    complaint_reason: response.data.complaint_reason || "",
    financial_vulnerability: response.data.financial_vulnerability || false,
    vulnerability_reason: response.data.vulnerability_reason || "",
    complaint_snippet: response.data.complaint_snippet || "",
    vulnerability_snippet: response.data.vulnerability_snippet || ""
  };
};
