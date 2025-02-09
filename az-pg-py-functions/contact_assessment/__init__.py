import logging
import os
import json
import sys
import azure.functions as func
import psycopg2

# Add the shared folder to sys.path so that modules there can be imported
current_dir = os.path.dirname(os.path.realpath(__file__))
shared_path = os.path.join(current_dir, "..", "shared")
if shared_path not in sys.path:
    sys.path.append(shared_path)

# Now import from assessment.py (shared folder)
from assessment import assess_complaints, assess_vulnerability, store_assessment_results

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    1) Parses contact_id from the request body.
    2) Connects to Azure PostgreSQL (psycopg2).
    3) Fetches conversation transcript from 'contact_conversations'.
    4) Calls complaint & vulnerability assessment logic.
    5) Stores results in 'ai_assess_complaints' / 'ai_assess_vulnerability'.
    6) Returns JSON with CORS headers.
    """

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    }
    
    # Handle CORS preflight
    if req.method == "OPTIONS":
        return func.HttpResponse("ok", status_code=204, headers=cors_headers)
    
    logging.info("contact_assessment function triggered (Python).")

    try:
        # Parse JSON body
        req_body = req.get_json()
        contact_id = req_body.get("contact_id")
        if not contact_id:
            raise ValueError("Contact ID is required")

        logging.info(f"Fetching conversation transcript for contact_id={contact_id}.")

        # Log DB env variables (just for debugging)
        logging.info("DB: host=%s user=%s dbname=%s port=%s",
            os.environ.get("PGHOST"),
            os.environ.get("PGUSER"),
            os.environ.get("PGDATABASE"),
            os.environ.get("PGPORT")
        )
        
        # Connect to Azure PostgreSQL
        conn = psycopg2.connect(
            host=os.environ.get("PGHOST"),
            user=os.environ.get("PGUSER"),
            password=os.environ.get("PGPASSWORD"),
            dbname=os.environ.get("PGDATABASE"),
            port=os.environ.get("PGPORT", 5432),
            sslmode="require"
        )
        cur = conn.cursor()

        # Fetch transcript from 'contact_conversations'
        transcript_query = """
            SELECT transcript
            FROM contact_conversations
            WHERE contact_id = %s
            LIMIT 1;
        """
        cur.execute(transcript_query, (contact_id,))
        row = cur.fetchone()
        if not row:
            logging.info("No conversation found for this contact.")
            raise ValueError("Failed to fetch conversation transcript")

        transcript = row[0] or None
        logging.info("Transcript found: %s", "Yes" if transcript else "No")

        # Perform assessments
        complaints_result = assess_complaints(cur, contact_id, transcript)
        vulnerability_result = assess_vulnerability(cur, contact_id, transcript)

        # Store results
        results = store_assessment_results(cur, contact_id, complaints_result, vulnerability_result)

        conn.commit()
        cur.close()
        conn.close()

        logging.info("Assessment completed successfully.")
        return func.HttpResponse(
            json.dumps(results),
            status_code=200,
            headers=cors_headers
        )
    except Exception as e:
        logging.error("Error: %s", str(e))
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            headers=cors_headers
        )
