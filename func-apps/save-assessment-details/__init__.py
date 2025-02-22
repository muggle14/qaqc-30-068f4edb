import azure.functions as func
import datetime
import json
import logging
import os
import psycopg2  # For PostgreSQL connections

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("save-assessment-details function triggered.")

    # 1) Handle the OPTIONS (CORS preflight) request first
    if req.method == 'OPTIONS':
        return func.HttpResponse(
            status_code=204,  # No Content
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        )

    # 2) Allow Only POST Requests
    if req.method != 'POST':
        return func.HttpResponse(
            json.dumps({"error": "Method not allowed."}),
            status_code=405,
            mimetype="application/json",
            headers={'Access-Control-Allow-Origin': '*'}
        )

    # 3) Parse and Validate JSON Input
    try:
        data = req.get_json()
    except ValueError:
        logging.error("Invalid JSON body received.")
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body."}),
            status_code=400,
            mimetype="application/json",
            headers={'Access-Control-Allow-Origin': '*'}
        )

    # Extract required fields
    aws_ref_id = data.get("awsRefId")
    tracksmart_id = data.get("tracksmartId")
    special_service_flag = data.get("specialServiceTeamFlag", False)

    transcript = data.get("transcript")
    overall_summary = data.get("overallSummary")
    detailed_summary = data.get("detailedSummary")

    physical_disability_status = data.get("physicalDisabilityStatus", False)
    complaints_assessment = data.get("complaintsAssessment", False)
    vulnerability_assessment = data.get("vulnerabilityAssessment", False)

    complaints = data.get("complaints", False)
    complaints_reason = data.get("complaintsReason", [])
    complaints_reason_other = data.get("complaintsReasonOther", "")
    complaints_assessment_reasoning = data.get("complaintsAssessmentReasoning", "")
    complaints_review_evidence = data.get("complaintsReviewEvidence", "")

    vulnerability = data.get("vulnerability", False)
    vulnerability_categories = data.get("vulnerabilityCategories", [])
    vulnerability_categories_other = data.get("vulnerabilityCategoriesOther", "")
    vulnerability_assessment_reasoning = data.get("vulnerabilityAssessmentReasoning", "")
    vulnerability_review_evidence = data.get("vulnerabilityReviewEvidence", "")

    # 4) Validate required fields
    if not aws_ref_id:
        return func.HttpResponse(
            json.dumps({"error": "awsRefId is required."}),
            status_code=400,
            mimetype="application/json",
            headers={'Access-Control-Allow-Origin': '*'}
        )

    # 5) Get PostgreSQL connection string from environment variables
    pg_conn_str = os.getenv("PG_CONN_STR")
    if not pg_conn_str:
        return func.HttpResponse(
            json.dumps({"error": "Database connection string (PG_CONN_STR) is not configured."}),
            status_code=500,
            mimetype="application/json",
            headers={'Access-Control-Allow-Origin': '*'}
        )

    # 6) Attempt to connect, upsert data, and return a proper response
    try:
        conn = psycopg2.connect(pg_conn_str)
        conn.autocommit = True
        cursor = conn.cursor()

        upsert_sql = """
            INSERT INTO public.assessment_details (
                aws_ref_id, tracksmart_id, special_service_team_flag,
                transcript, overall_summary, detailed_summary,
                physical_disability_status, complaints_assessment, vulnerability_assessment,
                complaints, complaints_reason, complaints_reason_other,
                complaints_assessment_reasoning, complaints_review_evidence,
                vulnerability, vulnerability_categories, vulnerability_categories_other,
                vulnerability_assessment_reasoning, vulnerability_review_evidence,
                updated_at
            )
            VALUES (
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, 
                %s, %s, %s,
                %s, %s, now()
            )
            ON CONFLICT (aws_ref_id) DO UPDATE
            SET tracksmart_id = EXCLUDED.tracksmart_id,
                special_service_team_flag = EXCLUDED.special_service_team_flag,
                transcript = EXCLUDED.transcript,
                overall_summary = EXCLUDED.overall_summary,
                detailed_summary = EXCLUDED.detailed_summary,
                physical_disability_status = EXCLUDED.physical_disability_status,
                complaints_assessment = EXCLUDED.complaints_assessment,
                vulnerability_assessment = EXCLUDED.vulnerability_assessment,
                complaints = EXCLUDED.complaints,
                complaints_reason = EXCLUDED.complaints_reason,
                complaints_reason_other = EXCLUDED.complaints_reason_other,
                complaints_assessment_reasoning = EXCLUDED.complaints_assessment_reasoning,
                complaints_review_evidence = EXCLUDED.complaints_review_evidence,
                vulnerability = EXCLUDED.vulnerability,
                vulnerability_categories = EXCLUDED.vulnerability_categories,
                vulnerability_categories_other = EXCLUDED.vulnerability_categories_other,
                vulnerability_assessment_reasoning = EXCLUDED.vulnerability_assessment_reasoning,
                vulnerability_review_evidence = EXCLUDED.vulnerability_review_evidence,
                updated_at = now();
        """

        cursor.execute(
            upsert_sql,
            (
                aws_ref_id, tracksmart_id, special_service_flag,
                transcript, overall_summary, detailed_summary,
                physical_disability_status, complaints_assessment, vulnerability_assessment,
                complaints, json.dumps(complaints_reason), complaints_reason_other,
                complaints_assessment_reasoning, complaints_review_evidence,
                vulnerability, json.dumps(vulnerability_categories), vulnerability_categories_other,
                vulnerability_assessment_reasoning, vulnerability_review_evidence,
            )
        )

        cursor.close()
        conn.close()

        return func.HttpResponse(
            body=json.dumps({"message": "Assessment details saved/updated successfully."}),
            status_code=200,
            mimetype="application/json",
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        )

    except Exception as e:
        logging.error(f"Error saving to Postgres: {str(e)}")
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json",
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        )
