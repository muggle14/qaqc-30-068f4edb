
import axios from "axios";

// Create an axios instance with common configuration
export const chatSummaryApi = axios.create({
  baseURL: "https://chat-summary.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers
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

const parseJsonString = (jsonString: string) => {
  try {
    // Remove markdown code block if present
    const cleanJson = jsonString.replace(/```json\n|\n```/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const getSummary = async (conversation: string) => {
  try {
    console.log("Calling getSummary with conversation:", conversation.substring(0, 100) + "...");
    const response = await chatSummaryApi.post("/chat-summary", {
      conversation,
    });
    
    const parsedData = parseJsonString(response.data);
    if (!parsedData) {
      throw new Error("Failed to parse summary response");
    }
    
    return {
      short_summary: parsedData.short_summary || "",
      detailed_bullet_summary: Array.isArray(parsedData.detailed_bullet_summary) 
        ? parsedData.detailed_bullet_summary 
        : []
    };
  } catch (error) {
    console.error("getSummary error:", error);
    throw error;
  }
};

export const getVAndCAssessment = async (conversation: string) => {
  try {
    console.log("Calling getVAndCAssessment with conversation:", conversation.substring(0, 100) + "...");
    const response = await chatSummaryApi.post("/vAndCAssessment", {
      conversation,
    });
    
    const parsedData = parseJsonString(response.data);
    if (!parsedData) {
      throw new Error("Failed to parse V&C assessment response");
    }
    
    return {
      complaint: parsedData.complaint || false,
      complaint_reason: parsedData.complaint_reason || "",
      financial_vulnerability: parsedData.financial_vulnerability || false,
      vulnerability_reason: parsedData.vulnerability_reason || "",
      complaint_snippet: parsedData.complaint_snippet || "",
      vulnerability_snippet: parsedData.vulnerability_snippet || ""
    };
  } catch (error) {
    console.error("getVAndCAssessment error:", error);
    throw error;
  }
};
