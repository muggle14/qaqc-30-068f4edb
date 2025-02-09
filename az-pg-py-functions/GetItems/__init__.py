import logging
import os
import json

import azure.functions as func
import psycopg2

# Import your assessment functions from assessment.py
from assessment import assess_complaints, assess_vulnerability, store_assessment_results

# Optionally, if you want to share CORS headers via a module, import them:
from shared.cors import CORS_HEADERS

def main(req: func.HttpRequest) -> func.HttpResponse:
    # Define CORS headers; these will be attached to every response
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    }
    
    # Handle CORS preflight requests
    if req.method == "OPTIONS":
        return func.HttpResponse("ok", status_code=204, headers=cors_headers)
    
    logging.info("Python contact-assessment function called.")

    try:
        # Parse JSON body
        req_body = req.get_json()
        contact_id = req_body.get("contact_id")
        if not contact_id:
            raise ValueError("Contact ID is required")
        
        logging.info(f"Fetching conversation transcript for contact: {contact_id}")
        
        # Connect to Azure PostgreSQL using credentials from environment variables
        conn = psycopg2.connect(
            host=os.environ.get("PGHOST"),
            user=os.environ.get("PGUSER"),
            password=os.environ.get("PGPASSWORD"),
            dbname=os.environ.get("PGDATABASE"),
            port=os.environ.get("PGPORT", 5432),
            sslmode="require"  # Azure PostgreSQL requires SSL
        )
        cur = conn.cursor()
        
        # Fetch conversation transcript from the 'contact_conversations' table
        transcript_query = """
            SELECT transcript
            FROM contact_conversations
            WHERE contact_id = %s
            LIMIT 1;
        """
        cur.execute(transcript_query, (contact_id,))
        row = cur.fetchone()
        if not row:
            raise ValueError("Failed to fetch conversation transcript")
        transcript = row[0]
        logging.info("Transcript found: " + ("Yes" if transcript else "No"))
        
        logging.info("Performing assessments")
        # Call assessment functions (ensure these are implemented in assessment.py)
        complaints_result = assess_complaints(cur, contact_id, transcript)
        vulnerability_result = assess_vulnerability(cur, contact_id, transcript)
        
        logging.info("Storing assessment results")
        results = store_assessment_results(cur, contact_id, complaints_result, vulnerability_result)
        
        # Commit if any inserts/updates are performed
        conn.commit()
        
        cur.close()
        conn.close()
        
        logging.info("Assessment completed successfully")
        return func.HttpResponse(json.dumps(results), status_code=200, headers=cors_headers)
    except Exception as e:
        logging.error("Error: " + str(e))
        return func.HttpResponse(json.dumps({"error": str(e)}), status_code=500, headers=cors_headers)
