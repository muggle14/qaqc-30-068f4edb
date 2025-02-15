
// Base URL for API endpoints - using Vite's environment variable format
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("API base URL not defined. Please set VITE_API_BASE_URL in your environment.");
}

export const apiClient = {
  /**
   * Invokes an Azure Function endpoint.
   * 
   * @param functionName - The name (or route) of the Azure Function (e.g., "contact-assessment", "GetItems").
   * @param payload - A JSON-serializable object to send as the request body.
   * @param method - The HTTP method to use ("POST" by default).
   * @returns A promise that resolves with the JSON response.
   */
  async invoke(functionName: string, payload: any, method = "POST"): Promise<any> {
    const url = `${API_BASE_URL}/${functionName}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },

  /**
   * Example method for GET requests without a request body.
   *
   * @param functionName - The name (or route) of the Azure Function (e.g., "GetItems").
   * @returns A promise that resolves with the JSON response.
   */
  async get(functionName: string): Promise<any> {
    const url = `${API_BASE_URL}/${functionName}`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in GET ${functionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
};
