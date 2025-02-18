
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

  // Handle the double-encoded JSON response
  try {
    let parsedData;
    if (typeof response.data.detailed_bullet_summary === 'string') {
      // Remove potential JSON code fence markers
      const cleanJson = response.data.detailed_bullet_summary.replace(/```json\n|```/g, '');
      parsedData = JSON.parse(cleanJson);
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
    console.error('Error parsing summary response:', error);
    return {
      short_summary: response.data.short_summary || "No summary available",
      detailed_bullet_summary: []
    };
  }
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
