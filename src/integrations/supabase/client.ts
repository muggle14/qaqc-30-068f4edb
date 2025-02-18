
// Base URL for API endpoints - using Vite's environment variable format
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API base URL not defined. Please set VITE_API_BASE_URL in your environment.");
}

interface AssessmentQuestion {
  id: string;
  aiAssessment: string;
  assessorFeedback: string;
}

export const apiClient = {
  /**
   * Generic invoke method for API calls
   */
  async invoke(functionName: string, payload: any, method = "POST"): Promise<any> {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please set VITE_API_BASE_URL in your environment.");
    }

    const url = `${API_BASE_URL}/${functionName}`;
    console.log("Calling API endpoint:", url);
    console.log("Request payload:", payload);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API response data:", responseData);
      return responseData;
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  },

  /**
   * Specialized method for saving assessment details
   */
  async saveAssessmentDetails(payload: {
    awsRefId: string;
    tracksmartId: string;
    transcript: string;
    specialServiceTeam: boolean;
    assessmentQuestions?: AssessmentQuestion[];
  }): Promise<any> {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please set VITE_API_BASE_URL in your environment.");
    }

    const url = `${API_BASE_URL}/save-assessment-details`;
    console.log("Saving assessment details to:", url);
    console.log("Assessment payload:", payload);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API response data:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error saving assessment details:", error);
      throw error;
    }
  },

  /**
   * GET request method.
   */
  async get(functionName: string): Promise<any> {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please set VITE_API_BASE_URL in your environment.");
    }

    const url = `${API_BASE_URL}/${functionName}`;
    console.log("Making GET request to:", url);
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API response data:", responseData);
      return responseData;
    } catch (error) {
      console.error(`Error in GET ${functionName}:`, error);
      throw error;
    }
  },
};
