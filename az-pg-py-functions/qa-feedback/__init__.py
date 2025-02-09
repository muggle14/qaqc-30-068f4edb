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
    # Basic CORS headers
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
        evaluator = body.get("evaluator")
        complaints_flag = body.get("complaints_flag", False)
        vulnerability_flag = body.get("vulnerability_flag", False)
        complaints_reasoning = body.get("complaints_reasoning", "")
        vulnerability_reasoning = body.get("vulnerability_reasoning", "")

        if not contact_id or not evaluator:
            raise ValueError("Both contact_id and evaluator are required.")

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

        # Upsert logic: Insert or update (like Supabase .upsert)
        upsert_query = """
        INSERT INTO quality_assessor_feedback (
          contact_id,
          evaluator,
          complaints_flag,
          vulnerability_flag,
          complaints_reasoning,
          vulnerability_reasoning
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (contact_id, evaluator) DO UPDATE SET
          complaints_flag = EXCLUDED.complaints_flag,
          vulnerability_flag = EXCLUDED.vulnerability_flag,
          complaints_reasoning = EXCLUDED.complaints_reasoning,
          vulnerability_reasoning = EXCLUDED.vulnerability_reasoning
        RETURNING *;
        """
        cur.execute(upsert_query, (
            contact_id,
            evaluator,
            complaints_flag,
            vulnerability_flag,
            complaints_reasoning,
            vulnerability_reasoning
        ))
        updated_row = cur.fetchone()
        conn.commit()

        cur.close()
        conn.close()

        # Return the row that was inserted/updated
        response_body = {
            "data": updated_row,  # Might be a tuple. You can map it to an object if you want
            "message": "Quality assessor feedback upserted successfully"
        }

        return func.HttpResponse(
            json.dumps(response_body),
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
