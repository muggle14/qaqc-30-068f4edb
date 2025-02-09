import logging
import random
import json

def get_random_snippets(cursor, contact_id: str, max_snippets: int = 3) -> list:
    logging.info(f"Getting random snippets for contact: {contact_id}, max: {max_snippets}")
    cursor.execute(
        "SELECT snippets_metadata FROM contact_conversations WHERE contact_id = %s LIMIT 1;",
        (contact_id,)
    )
    row = cursor.fetchone()
    if not row:
        logging.info("No conversation found for this contact.")
        return []

    snippets_metadata = row[0]
    # If it's a JSON string, parse it
    if isinstance(snippets_metadata, str):
        snippets = json.loads(snippets_metadata)
    else:
        snippets = snippets_metadata or []

    logging.info(f"Total snippets available: {len(snippets)}")
    random.shuffle(snippets)
    selected = snippets[:max_snippets]
    snippet_ids = [s.get("id") for s in selected if "id" in s]
    logging.info("Selected random snippet IDs: " + str(snippet_ids))
    return snippet_ids

def assess_complaints(cursor, contact_id: str, transcript: str or None) -> dict:
    logging.info("Starting complaints assessment")
    relevant_snippet_ids = get_random_snippets(cursor, contact_id, 3)
    # Hard-coded logic (replace with real analysis)
    has_complaints = False
    has_disability = False

    return {
        "complaints_flag": has_complaints,
        "complaints_reasoning": (
            "Conversation mentions complaints."
            if has_complaints else "No significant complaints detected."
        ),
        "physical_disability_flag": has_disability,
        "physical_disability_reasoning": (
            "The conversation indicates physical disability."
            if has_disability else "No indicators of physical disability found."
        ),
        "relevant_snippet_ids": relevant_snippet_ids,
    }

def assess_vulnerability(cursor, contact_id: str, transcript: str or None) -> dict:
    logging.info("Starting vulnerability assessment")
    relevant_snippet_ids = get_random_snippets(cursor, contact_id, 3)
    has_vulnerability = False

    return {
        "vulnerability_flag": has_vulnerability,
        "vulnerability_reasoning": (
            "Conversation indicates potential vulnerability."
            if has_vulnerability else "No clear vulnerability indicators."
        ),
        "relevant_snippet_ids": relevant_snippet_ids,
    }

def store_assessment_results(cursor, contact_id: str, complaints_result: dict, vulnerability_result: dict) -> dict:
    logging.info(f"Storing assessment results for contact: {contact_id}")

    # Upsert in 'ai_assess_complaints'
    cursor.execute(
        """
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
        """,
        (
            contact_id,
            complaints_result["complaints_flag"],
            complaints_result["complaints_reasoning"],
            complaints_result["physical_disability_flag"],
            complaints_result["physical_disability_reasoning"],
            json.dumps(complaints_result["relevant_snippet_ids"])
        )
    )
    complaints_data = cursor.fetchone()

    # Upsert in 'ai_assess_vulnerability'
    cursor.execute(
        """
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
        """,
        (
            contact_id,
            vulnerability_result["vulnerability_flag"],
            vulnerability_result["vulnerability_reasoning"],
            json.dumps(vulnerability_result["relevant_snippet_ids"])
        )
    )
    vulnerability_data = cursor.fetchone()

    return {
        "complaints": complaints_data,
        "vulnerability": vulnerability_data
    }
