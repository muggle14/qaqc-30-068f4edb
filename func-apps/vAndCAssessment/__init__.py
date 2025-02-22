import os
import json
import logging
import openai
import azure.functions as func
from pydantic import BaseModel, Field, ValidationError
import re  # Import regex module

# Set up OpenAI key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define Pydantic Model for Response Validation
class VCAssessmentResponse(BaseModel):
    financial_vulnerability: bool = Field(default=False)
    vulnerability_reason: str = Field(default="No vulnerability identified.")
    vulnerability_snippet: str = Field(default="")
    complaint: bool = Field(default=False)
    complaint_reason: str = Field(default="No complaints identified.")
    complaint_snippet: str = Field(default="")

def clean_json_response(response_text: str) -> str:
    """Ensures OpenAI response is valid JSON by removing markdown artifacts."""
    response_text = re.sub(r"```json|```", "", response_text, flags=re.MULTILINE).strip()
    
    # If response is empty or malformed, return a default structure
    try:
        json.loads(response_text)
    except json.JSONDecodeError:
        logging.error(f"Invalid JSON from OpenAI: {response_text}")
        return json.dumps({
            "financial_vulnerability": False,
            "vulnerability_reason": "Not detected",
            "vulnerability_snippet": "",
            "complaint": False,
            "complaint_reason": "Not detected",
            "complaint_snippet": ""
        })

    return response_text

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("V&C Assessment function triggered.")

    # 1) Handle CORS Preflight Requests
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true"
            }
        )

    # 2) Allow Only POST Requests
    if req.method != "POST":
        return func.HttpResponse(
            json.dumps({"error": "Method not allowed."}),
            status_code=405,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    # 3) Parse and Validate JSON Input
    try:
        req_body = req.get_json()
        conversation = req_body.get("conversation", "")
        if not conversation:
            return func.HttpResponse(
                json.dumps({"error": "Missing 'conversation' field in JSON."}),
                status_code=400,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
    except (ValueError, json.JSONDecodeError) as e:
        logging.error(f"Invalid JSON request: {e}")
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON request"}),
            status_code=400,
            mimetype="application/json"
        )

    # 4) Create Prompt for OpenAI API
    prompt = f"""
You are analyzing a financial support conversation between a customer and an agent.

**Your task:**
1. Identify financial vulnerability by analyzing key statements where the customer expresses financial distress.
   - Extract the specific reason the customer is struggling financially.
   - Provide a direct quote from the conversation that best represents this vulnerability.

2. Detect complaints by looking for negative sentiments about services, policies, or products.
   - Extract the exact complaint and why the customer is dissatisfied.
   - Provide a direct quote from the conversation as a supporting snippet.

Return only JSON with no explanations, markdown, or formatting hints.

Example JSON:
{{
  "financial_vulnerability": true,
  "vulnerability_reason": "Customer is struggling to make mortgage payments due to financial distress.",
  "vulnerability_snippet": "I haven’t been able to make my mortgage payment, and I’m starting to panic.",
  "complaint": true,
  "complaint_reason": "Customer is unhappy about missing a mortgage rate update and concerned about loan partner withdrawing support.",
  "complaint_snippet": "I even got a better rate on my mortgage during a recent rate change, but I couldn’t make it to the branch to update the plan."
}}

Conversation:
{conversation}
"""

    # 5) Call OpenAI for Analysis
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an AI that identifies financial vulnerability and complaints."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )

        ai_reply = response["choices"][0]["message"]["content"]
        logging.info(f"Raw OpenAI Response: {ai_reply}")

        # 6) Validate and Structure OpenAI Response using Pydantic
        try:
            cleaned_response = clean_json_response(ai_reply)
            structured_response = VCAssessmentResponse.model_validate_json(cleaned_response)
        except (ValidationError, json.JSONDecodeError) as e:
            logging.error(f"AI response is not valid JSON: {e}")
            return func.HttpResponse(
                json.dumps({
                    "error": "AI response could not be parsed as valid JSON.",
                    "raw_response": ai_reply
                }),
                status_code=500,
                mimetype="application/json"
            )

        return func.HttpResponse(
            structured_response.model_dump_json(indent=2),
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
        logging.error(f"OpenAI API error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
