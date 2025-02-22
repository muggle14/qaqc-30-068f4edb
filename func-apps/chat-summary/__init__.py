import os
import json
import logging
import openai
import azure.functions as func
from pydantic import BaseModel, Field

# Initialize OpenAI API with environment key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define Pydantic Model for Response Formatting
class SummaryResponse(BaseModel):
    short_summary: str = Field(default="No overall summary available.")
    detailed_bullet_summary: list[str] = Field(default=[])

def format_summary_response(response_text: str) -> str:
    try:
        parsed_response = json.loads(response_text)

        # Ensure correct structure using Pydantic
        summary = SummaryResponse(
            short_summary=parsed_response.get("short_summary", "No overall summary available."),
            detailed_bullet_summary=parsed_response.get("detailed_bullet_summary", "").split("\n") 
            if isinstance(parsed_response.get("detailed_bullet_summary"), str) else parsed_response.get("detailed_bullet_summary", [])
        )
        
        return summary.json(indent=2)  # Return properly formatted JSON

    except json.JSONDecodeError:
        return SummaryResponse().json(indent=2)  # Return a default valid response if parsing fails

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("chat-summary function triggered to summarize conversation with ChatGPT.")

    # 1) Handle CORS Preflight Requests (OPTIONS Method)
    if req.method == 'OPTIONS':
        return func.HttpResponse(
            status_code=204,  # No Content
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true"
            }
        )

    # 2) Allow Only POST Requests
    if req.method != 'POST':
        return func.HttpResponse(
            json.dumps({"error": "Method not allowed."}),
            status_code=405,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    # 3) Parse and Validate JSON Input
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            status_code=400,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    conversation_text = req_body.get("conversation", "")
    if not conversation_text:
        return func.HttpResponse(
            json.dumps({"error": "Missing 'conversation' field in JSON."}),
            status_code=400,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    # 4) Construct the OpenAI API Prompt
    prompt = f"""
You are given a conversation between a support agent and a customer.
1. Provide a short summary of the conversation in under 30 words.
2. Provide a detailed bullet-point summary capturing key events in the conversation.

Conversation:
{conversation_text}

Format the output as a JSON object with two fields:
"short_summary": <string>,
"detailed_bullet_summary": <string>.
"""

    # 5) Call OpenAI for the summary
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # Use "gpt-4", "gpt-3.5-turbo" if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )

        # Extract AI response
        chat_response = response["choices"][0]["message"]["content"]

        # Format response using Pydantic model
        formatted_response = format_summary_response(chat_response)

        return func.HttpResponse(
            body=formatted_response,
            status_code=200,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true"
            }
        )

    except Exception as e:
        logging.error(f"Error from OpenAI API: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true"
            }
        )
