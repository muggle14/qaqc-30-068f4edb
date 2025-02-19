
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
    throw new Error(error.message || "Failed to make request");
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
    
    // Enhance error message based on status code
    if (error.response?.status === 404) {
      throw new Error("API endpoint not found. Please check the URL.");
    } else if (error.response?.status === 403) {
      throw new Error("Access forbidden. CORS issue may be present.");
    } else if (error.response?.status === 500) {
      throw new Error("Server error occurred. Please try again later.");
    }
    
    throw new Error(error.response?.data?.error || error.message || "An unknown error occurred");
  }
);

interface SummaryResponse {
  short_summary: string;
  detailed_bullet_summary: string[];
}

interface VAndCAssessmentResponse {
  financial_vulnerability: boolean;
  vulnerability_reason: string;
  vulnerability_snippet: string;
  complaint: boolean;
  complaint_reason: string;
  complaint_snippet: string;
}

export const getSummary = async (conversation: string): Promise<SummaryResponse> => {
  try {
    const response = await chatSummaryApi.post("/chat-summary", {
      conversation: conversation
    });
    
    if (!response.data) {
      throw new Error("Empty response received from server");
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    let parsedData;
    if (typeof response.data.detailed_bullet_summary === 'string') {
      const cleanJson = response.data.detailed_bullet_summary.replace(/```json\n|```/g, '');
      try {
        parsedData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('Error parsing detailed_bullet_summary:', parseError);
        const bulletPoints = cleanJson.split('\n')
          .filter(line => line.trim())
          .map(line => line.trim().replace(/^- /, ''));
        return {
          short_summary: response.data.short_summary || "No summary available",
          detailed_bullet_summary: bulletPoints
        };
      }
    }

    return {
      short_summary: parsedData?.short_summary || response.data.short_summary || "No summary available",
      detailed_bullet_summary: Array.isArray(parsedData?.detailed_bullet_summary) 
        ? parsedData.detailed_bullet_summary 
        : typeof parsedData?.detailed_bullet_summary === 'string'
          ? parsedData.detailed_bullet_summary.split('\n').filter(Boolean).map(line => line.trim().replace(/^- /, ''))
          : []
    };
  } catch (error) {
    console.error('Error in getSummary:', error);
    throw error instanceof Error ? error : new Error('Failed to get summary');
  }
};

export const getVAndCAssessment = async (conversation: string): Promise<VAndCAssessmentResponse> => {
  try {
    console.log("Fetching V&C assessment for conversation:", conversation);
    const response = await chatSummaryApi.post("/vandcassessment", {
      conversation: conversation
    });

    if (!response.data) {
      throw new Error("Empty response received from server");
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return {
      financial_vulnerability: response.data.financial_vulnerability || false,
      vulnerability_reason: response.data.vulnerability_reason || "No vulnerability detected",
      vulnerability_snippet: response.data.vulnerability_snippet || "No relevant snippets found",
      complaint: response.data.complaint || false,
      complaint_reason: response.data.complaint_reason || "No complaints detected",
      complaint_snippet: response.data.complaint_snippet || "No relevant snippets found"
    };
  } catch (error) {
    console.error('Error in getVAndCAssessment:', error);
    throw error instanceof Error ? error : new Error('Failed to get V&C assessment');
  }
};
