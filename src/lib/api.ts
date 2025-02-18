
import axios from "axios";

export const chatSummaryApi = axios.create({
  baseURL: "https://chat-summary.azurewebsites.net/api",
});

export const getSummary = async (conversation: string) => {
  const response = await chatSummaryApi.post("/chat-summary", {
    conversation,
  });
  return response.data;
};
