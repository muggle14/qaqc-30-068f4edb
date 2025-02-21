interface AssessmentQuestion {
  id: string;
  aiAssessment: string;
  assessorFeedback: string;
}

interface SaveAssessmentPayload {
  awsRefId: string;
  tracksmartId: string;
  transcript: string;
  specialServiceTeam: boolean;
  assessmentQuestions?: AssessmentQuestion[];
  complaints?: any;
  vulnerabilities?: any;
}

export const apiClient = {
  async invoke(functionName: string, payload: any, method = "POST"): Promise<any> {
    console.log("API call to:", functionName, "with payload:", payload);
    if (functionName === "format-transcript") {
      const lines = payload.transcript.split('\n');
      const formattedLines = lines.map((line: string, index: number) => {
        const prefix = index % 2 === 0 ? "Agent: " : "Customer: ";
        return line.trim().startsWith("Agent:") || line.trim().startsWith("Customer:") 
          ? line.trim() 
          : prefix + line.trim();
      });
      return {
        success: true,
        data: {
          formatted_transcript: formattedLines.join('\n')
        }
      };
    }
    return {
      success: true,
      data: {
        short_summary: "Placeholder summary",
        detailed_bullet_summary: ["Point 1", "Point 2"],
        overall_summary: "Placeholder overall summary",
        detailed_summary_points: ["Detail 1", "Detail 2"]
      }
    };
  },

  async formatTranscript(transcript: string): Promise<string> {
    const response = await this.invoke("format-transcript", { transcript });
    if (response.success) {
      return response.data.formatted_transcript;
    }
    throw new Error("Failed to format transcript");
  },

  async saveAssessmentDetails(payload: SaveAssessmentPayload): Promise<any> {
    console.log("Saving assessment details:", payload);
    return {
      success: true,
      data: {
        message: "Assessment details saved successfully (mock)"
      }
    };
  },

  async get(functionName: string): Promise<any> {
    console.log("GET request to:", functionName);
    return {
      success: true,
      data: {
        items: []
      }
    };
  },
};
