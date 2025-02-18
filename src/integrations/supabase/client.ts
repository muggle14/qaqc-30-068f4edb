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
  async invoke(functionName: string, payload: any, method = "POST"): Promise<any> {
    console.log("Mock API call to:", functionName, "with payload:", payload);
    // Return mock data
    return {
      success: true,
      data: {
        // Mock data structure
        short_summary: "Placeholder summary",
        detailed_bullet_summary: ["Point 1", "Point 2"],
        overall_summary: "Placeholder overall summary",
        detailed_summary_points: ["Detail 1", "Detail 2"]
      }
    };
  },

  async saveAssessmentDetails(payload: {
    awsRefId: string;
    tracksmartId: string;
    transcript: string;
    specialServiceTeam: boolean;
    assessmentQuestions?: AssessmentQuestion[];
  }): Promise<any> {
    console.log("Mock saving assessment details:", payload);
    // TODO: Implement actual save functionality
    return {
      success: true,
      data: {
        message: "Assessment details saved successfully (mock)"
      }
    };
  },

  async get(functionName: string): Promise<any> {
    console.log("Mock GET request to:", functionName);
    return {
      success: true,
      data: {
        // Mock data structure
        items: []
      }
    };
  },
};
