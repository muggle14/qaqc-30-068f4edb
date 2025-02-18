
import axios from 'axios';

const BASE_URL = 'https://chat-summary.azurewebsites.net/api';

export interface ChatSummaryResponse {
  short_summary: string;
  detailed_bullet_summary: string[];
}

export interface VCAssessmentResponse {
  financial_vulnerability: boolean;
  vulnerability_reason: string;
  vulnerability_snippet: string;
  complaint: boolean;
  complaint_reason: string;
  complaint_snippet: string;
}

export interface SaveAssessmentRequest {
  awsRefId: string;
  tracksmartId: string;
  specialServiceTeamFlag: boolean;
  transcript: string;
  overallSummary: string;
  detailedSummary: string[];
  complaints: {
    hasComplaints: boolean;
    reason: string;
    analysisEvidence: string;
  };
  vulnerability: {
    hasVulnerability: boolean;
    reason: string;
    analysisEvidence: string;
  };
}

export const api = {
  getChatSummary: async (conversation: string): Promise<ChatSummaryResponse> => {
    const { data } = await axios.post(`${BASE_URL}/chat-summary`, {
      conversation
    });
    return data;
  },

  getVCAssessment: async (conversation: string): Promise<VCAssessmentResponse> => {
    const { data } = await axios.post(`${BASE_URL}/vAndCAssessment`, {
      conversation
    });
    return data;
  },

  saveAssessmentDetails: async (assessment: SaveAssessmentRequest): Promise<void> => {
    await axios.post(`${BASE_URL}/save-assessment-details`, assessment);
  }
};
