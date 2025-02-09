// client.ts
// ----------------------------------------------------------------------
// This file was formerly auto-generated to create a Supabase client.
// As part of the migration from Supabase to Azure Functions + Azure PostgreSQL,
// we no longer need a Supabase client. Instead, we export a simple API client
// that uses HTTP fetch to call our new Azure Functions endpoints.
//
// All UI code that previously imported `supabase` should be updated to import
// and use `apiClient` (or a similarly named module). You may also choose to
// create a separate module (e.g., "apiClient.ts") and remove this file entirely.
// ----------------------------------------------------------------------

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
      // Use the base URL from your environment variable (e.g., "https://my-pg-functions.azurewebsites.net/api")
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("API base URL not defined. Please set REACT_APP_API_BASE_URL in your environment.");
      }
  
      const url = `${baseUrl}/${functionName}`;
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
    },
  
    /**
     * Example method for GET requests without a request body.
     *
     * @param functionName - The name (or route) of the Azure Function (e.g., "GetItems").
     * @returns A promise that resolves with the JSON response.
     */
    async get(functionName: string): Promise<any> {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("API base URL not defined. Please set REACT_APP_API_BASE_URL in your environment.");
      }
  
      const url = `${baseUrl}/${functionName}`;
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
    },
  };
  