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
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    }

    if req.method == "OPTIONS":
        return func.HttpResponse("ok", status_code=204, headers=cors_headers)

    try:
        logging.info("Fetching joined data from upload_details and contact_conversations")

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

        # Example join:
        #  - 'upload_details' has contact_id, evaluator, upload_timestamp
        #  - 'contact_conversations' has contact_id, transcript, updated_at
        # Adjust table/column names as needed
        query = """
        SELECT 
            ud.contact_id,
            ud.evaluator,
            ud.upload_timestamp,
            cc.transcript,
            cc.updated_at
        FROM upload_details ud
        LEFT JOIN contact_conversations cc 
            ON ud.contact_id = cc.contact_id
        """
        cur.execute(query)
        rows = cur.fetchall()

        # We can map each row to an object
        result = []
        for row in rows:
            # row = (contact_id, evaluator, upload_timestamp, transcript, updated_at)
            result.append({
                "contact_id": row[0],
                "evaluator": row[1],
                "upload_timestamp": row[2].isoformat() if row[2] else None,
                "transcript": row[3],
                "updated_at": row[4].isoformat() if row[4] else None
            })

        cur.close()
        conn.close()

        return func.HttpResponse(
            json.dumps(result),
            status_code=200,
            headers=cors_headers
        )
    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            headers=cors_headers
        )
