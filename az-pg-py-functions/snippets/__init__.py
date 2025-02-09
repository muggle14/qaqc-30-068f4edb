import logging
import os
import json
import azure.functions as func
import psycopg2
import sys

# Add the shared folder to sys.path so that modules there can be imported
current_dir = os.path.dirname(os.path.realpath(__file__))
shared_path = os.path.join(current_dir, "..", "shared")
if shared_path not in sys.path:
    sys.path.append(shared_path)

# Now import from assessment.py
from assessment import assess_complaints, assess_vulnerability, store_assessment_results

def main(req: func.HttpRequest) -> func.HttpResponse:
    # CORS headers
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    }

    if req.method == "OPTIONS":
        return func.HttpResponse("ok", status_code=204, headers=cors_headers)

    try:
        body = req.get_json()
        contact_id = body.get("contact_id")
        snippet_ids = body.get("snippet_ids", [])

        if not contact_id:
            raise ValueError("contact_id is required")

        # Connect to Azure PostgreSQL
        conn = psycopg2.connect(
            host=os.environ["PGHOST"],
            user=os.environ["PGUSER"],
            password=os.environ["PGPASSWORD"],
            dbname=os.environ["PGDATABASE"],
            port=os.environ.get("PGPORT", 5432),
            sslmode="require"
        )
        cur = conn.cursor()

        # Retrieve the snippet metadata from "contact_conversations"
        cur.execute("""
            SELECT snippets_metadata
            FROM contact_conversations
            WHERE contact_id = %s
            LIMIT 1;
        """, (contact_id,))
        row = cur.fetchone()

        if not row:
            # No conversation data found
            cur.close()
            conn.close()
            return func.HttpResponse(json.dumps([]), status_code=200, headers=cors_headers)

        all_snippets_data = row[0]  # Could be JSON or text

        if isinstance(all_snippets_data, str):
            all_snippets = json.loads(all_snippets_data)
        else:
            all_snippets = all_snippets_data or []

        # If snippet_ids is provided, filter them
        if snippet_ids:
            relevant_snippets = [s for s in all_snippets if s.get("id") in snippet_ids]
        else:
            relevant_snippets = all_snippets

        cur.close()
        conn.close()

        return func.HttpResponse(json.dumps(relevant_snippets), status_code=200, headers=cors_headers)
    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            headers=cors_headers
        )
