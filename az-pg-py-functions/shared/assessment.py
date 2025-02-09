import logging
import json

def assess_complaints(cursor, contact_id, transcript):
    # Example: Return a dict with relevant_snippet_ids as a Python list
    # If the column is text[], we do NOT do json.dumps(...) here.
    snippet_ids = ["1", "2"]  # or call get_random_snippets, etc.
    return {
        "complaints_flag": False,
        "complaints_reasoning": "No significant complaints found.",
        "physical_disability_flag": False,
        "physical_disability_reasoning": "No indicators of physical disability found.",
        "relevant_snippet_ids": snippet_ids
    }

def assess_vulnerability(cursor, contact_id, transcript):
    snippet_ids = ["v1"]  
    return {
        "vulnerability_flag": False,
        "vulnerability_reasoning": "No vulnerability found.",
        "relevant_snippet_ids": snippet_ids
    }

def store_assessment_results(cursor, contact_id, complaints_result, vulnerability_result):
    logging.info(f"Storing assessment results for contact: {contact_id}")

    # This approach is for text[] columns, passing Python lists.
    snippet_ids_c = complaints_result.get("relevant_snippet_ids") or []
    snippet_ids_v = vulnerability_result.get("relevant_snippet_ids") or []

    # Upsert into ai_assess_complaints
    complaints_query = """
    INSERT INTO ai_assess_complaints (
      contact_id, 
      complaints_flag, 
      complaints_reasoning, 
      physical_disability_flag, 
      physical_disability_reasoning, 
      relevant_snippet_ids
    )
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (contact_id) DO UPDATE SET
      complaints_flag = EXCLUDED.complaints_flag,
      complaints_reasoning = EXCLUDED.complaints_reasoning,
      physical_disability_flag = EXCLUDED.physical_disability_flag,
      physical_disability_reasoning = EXCLUDED.physical_disability_reasoning,
      relevant_snippet_ids = EXCLUDED.relevant_snippet_ids
    RETURNING *;
    """
    cursor.execute(
        complaints_query,
        (
            contact_id,
            complaints_result.get("complaints_flag"),
            complaints_result.get("complaints_reasoning"),
            complaints_result.get("physical_disability_flag"),
            complaints_result.get("physical_disability_reasoning"),
            snippet_ids_c
        )
    )
    complaints_data = cursor.fetchone()

    # Upsert into ai_assess_vulnerability
    vulnerability_query = """
    INSERT INTO ai_assess_vulnerability (
      contact_id,
      vulnerability_flag,
      vulnerability_reasoning,
      relevant_snippet_ids
    )
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (contact_id) DO UPDATE SET
      vulnerability_flag = EXCLUDED.vulnerability_flag,
      vulnerability_reasoning = EXCLUDED.vulnerability_reasoning,
      relevant_snippet_ids = EXCLUDED.relevant_snippet_ids
    RETURNING *;
    """
    cursor.execute(
        vulnerability_query,
        (
            contact_id,
            vulnerability_result.get("vulnerability_flag"),
            vulnerability_result.get("vulnerability_reasoning"),
            snippet_ids_v
        )
    )
    vulnerability_data = cursor.fetchone()

    return {
        "complaints": complaints_data,
        "vulnerability": vulnerability_data
    }
