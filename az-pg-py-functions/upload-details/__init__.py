
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
        if req.method == "POST":
            try:
                req_body = req.get_json()
                if not req_body or 'data' not in req_body:
                    return func.HttpResponse(
                        json.dumps({"error": "No data provided"}),
                        status_code=400,
                        headers=cors_headers
                    )

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

                # Insert the data
                for item in req_body['data']:
                    cur.execute("""
                        INSERT INTO upload_details 
                        (contact_id, evaluator, transcript, admin_id, special_service_team) 
                        VALUES (%s, %s, %s, %s, %s)
                        """, 
                        (item['contact_id'], 
                         item['evaluator'], 
                         item.get('transcript', ''),
                         item.get('admin_id'),
                         item.get('special_service_team', False))
                    )

                conn.commit()
                cur.close()
                conn.close()

                return func.HttpResponse(
                    json.dumps({"success": True}),
                    status_code=200,
                    headers=cors_headers
                )

            except Exception as e:
                logging.error(f"Error processing POST request: {str(e)}")
                return func.HttpResponse(
                    json.dumps({"error": str(e)}),
                    status_code=500,
                    headers=cors_headers
                )

        # GET request handling
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

        result = []
        for row in rows:
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
