import logging
import random
import json

def get_random_snippets(cursor, contact_id: str, max_snippets: int = 3) -> list:
    """
    Fetch random snippet IDs for the given contact from the 'contact_conversations' table.
    Expects that the 'snippets_metadata' column contains a JSON array of snippet objects.
    Each snippet object should have an "id" property.
    """
    logging.info(f"Getting random snippets for contact: {contact_id}, max: {max_snippets}")

    try:
        # Query to get the snippets_metadata column from contact_conversations for the given contact_id.
        cursor.execute(
            "SELECT snippets_metadata FROM contact_conversations WHERE contact_id = %s LIMIT 1;",
            (contact_id,)
        )
        row = cursor.fetchone()
        if not row:
            logging.info("No conversation found for this contact.")
            return []
        
        snippets_metadata = row[0]
        # If the column returns a string (JSON text), parse it; otherwise assume it's already a Python object.
        if isinstance(snippets_metadata, str):
            snippets = json.loads(snippets_metadata)
        else:
            snippets = snippets_metadata

        if not snippets:
            logging.info("No snippets found in conversation.")
            return []
        
        logging.info(f"Total snippets available: {len(snippets)}")

        # Shuffle the list randomly and take the first max_snippets elements.
        random.shuffle(snippets)
        selected_snippets = snippets[:max_snippets]

        # Map the selected snippet objects to their IDs.
        snippet_ids = [snippet.get("id") for snippet in selected_snippets if "id" in snippet]
        logging.info("Selected random snippet IDs: " + str(snippet_ids))
        return snippet_ids
    except Exception as e:
        logging.error(f"Error in get_random_snippets: {e}")
        return []

def assess_complaints(cursor, contact_id: str, transcript: str or None) -> dict:
    """
    Analyzes the transcript for complaints.
    Returns a dictionary conforming to ComplaintsResult.
    """
    logging.info("Starting complaints assessment")
    
    # Get random snippet IDs for the assessment.
    relevant_snippet_ids = get_random_snippets(cursor, contact_id, 3)
    
    # For now, we set default flags. (Replace this with your actual analysis logic.)
    has_complaints = False
    has_disability = False

    result = {
        "complaints_flag": has_complaints,
        "complaints_reasoning": (
            "The conversation contains mentions of complaints or issues."
            if has_complaints else "No significant complaints detected in the conversation."
        ),
        "physical_disability_flag": has_disability,
        "physical_disability_reasoning": (
            "The conversation indicates presence of physical disability."
            if has_disability else "No clear indicators of physical disability found."
        ),
        "relevant_snippet_ids": relevant_snippet_ids
    }
    return result

def assess_vulnerability(cursor, contact_id: str, transcript: str or None) -> dict:
    """
    Analyzes the transcript for vulnerability.
    Returns a dictionary conforming to VulnerabilityResult.
    """
    logging.info("Starting vulnerability assessment")
    
    # Get random snippet IDs for vulnerability assessment.
    relevant_snippet_ids = get_random_snippets(cursor, contact_id, 3)
    
    has_vulnerability = False  # Replace with your actual logic

    result = {
        "vulnerability_flag": has_vulnerability,
        "vulnerability_reasoning": (
            "The conversation indicates potential vulnerability."
            if has_vulnerability else "No clear vulnerability indicators detected."
        ),
        "relevant_snippet_ids": relevant_snippet_ids
    }
    return result

def store_assessment_results(cursor, contact_id: str, complaints_result: dict, vulnerability_result: dict) -> dict:
    """
    Stores (or upserts) the assessment results into the database.
    In this example, we perform upsert-like behavior using PostgreSQL's INSERT ... ON CONFLICT syntax.
    
    Adjust the SQL queries if your schema differs.
    
    Returns a combined dictionary with the stored complaints and vulnerability data.
    """
    logging.info(f"Storing assessment results for contact: {contact_id}")

    # Upsert for ai_assess_complaints table.
    complaints_query = """
    INSERT INTO ai_assess_complaints (
      contact_id, complaints_flag, complaints_reasoning, physical_disability_flag, physical_disability_reasoning, relevant_snippet_ids
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
    cursor.execute(complaints_query, (
        contact_id,
        complaints_result.get("complaints_flag"),
        complaints_result.get("complaints_reasoning"),
        complaints_result.get("physical_disability_flag"),
        complaints_result.get("physical_disability_reasoning"),
        json.dumps(complaints_result.get("relevant_snippet_ids"))
    ))
    complaints_data = cursor.fetchone()

    # Upsert for ai_assess_vulnerability table.
    vulnerability_query = """
    INSERT INTO ai_assess_vulnerability (
      contact_id, vulnerability_flag, vulnerability_reasoning, relevant_snippet_ids
    )
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (contact_id) DO UPDATE SET 
      vulnerability_flag = EXCLUDED.vulnerability_flag,
      vulnerability_reasoning = EXCLUDED.vulnerability_reasoning,
      relevant_snippet_ids = EXCLUDED.relevant_snippet_ids
    RETURNING *;
    """
    cursor.execute(vulnerability_query, (
        contact_id,
        vulnerability_result.get("vulnerability_flag"),
        vulnerability_result.get("vulnerability_reasoning"),
        json.dumps(vulnerability_result.get("relevant_snippet_ids"))
    ))
    vulnerability_data = cursor.fetchone()

    return {
        "complaints": complaints_data,
        "vulnerability": vulnerability_data
    }
