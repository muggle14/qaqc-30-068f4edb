from typing import Dict, Any, List, Optional
import json
import openai
from supabase import create_client, Client

def get_supabase_client() -> Client:
    url: str = "https://lbljwlbqmgaivwryxicg.supabase.co"
    key: str = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    return create_client(url, key)

def assess_complaints(transcript: str) -> Dict[str, Any]:
    try:
        print("Starting complaints assessment")
        # OpenAI call to assess complaints
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI trained to analyze customer service transcripts."},
                {"role": "user", "content": f"Analyze this transcript for any complaints: {transcript}"}
            ]
        )
        
        print("OpenAI response received:", response)
        analysis = response.choices[0].message.content
        has_complaints = "complaint" in analysis.lower()
        
        return {
            "complaints_flag": has_complaints,
            "complaints_reasoning": analysis,
            "physical_disability_flag": False,
            "physical_disability_reasoning": None
        }
    except Exception as e:
        print(f"Error in assess_complaints: {str(e)}")
        raise Exception("Failed to fetch complaints assessment")

def assess_vulnerability(transcript: str) -> Dict[str, Any]:
    try:
        print("Starting vulnerability assessment")
        # OpenAI call to assess vulnerability
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI trained to identify customer vulnerabilities."},
                {"role": "user", "content": f"Analyze this transcript for signs of vulnerability: {transcript}"}
            ]
        )
        
        print("OpenAI response received:", response)
        analysis = response.choices[0].message.content
        is_vulnerable = "vulnerable" in analysis.lower()
        
        return {
            "vulnerability_flag": is_vulnerable,
            "vulnerability_reasoning": analysis
        }
    except Exception as e:
        print(f"Error in assess_vulnerability: {str(e)}")
        raise Exception("Failed to fetch vulnerability assessment")

def store_assessment_results(
    supabase: Client,
    contact_id: str,
    complaints_result: Dict[str, Any],
    vulnerability_result: Dict[str, Any]
) -> Dict[str, Any]:
    try:
        print(f"Storing assessment results for contact_id: {contact_id}")
        # Store complaints assessment
        complaints_data = {
            "contact_id": contact_id,
            "complaints_flag": complaints_result["complaints_flag"],
            "complaints_reasoning": complaints_result["complaints_reasoning"],
            "physical_disability_flag": complaints_result["physical_disability_flag"],
            "physical_disability_reasoning": complaints_result["physical_disability_reasoning"]
        }
        
        complaints_response = supabase.table("ai_assess_complaints").insert(complaints_data).execute()
        print("Complaints assessment stored:", complaints_response)
        
        # Store vulnerability assessment
        vulnerability_data = {
            "contact_id": contact_id,
            "vulnerability_flag": vulnerability_result["vulnerability_flag"],
            "vulnerability_reasoning": vulnerability_result["vulnerability_reasoning"]
        }
        
        vulnerability_response = supabase.table("ai_assess_vulnerability").insert(vulnerability_data).execute()
        print("Vulnerability assessment stored:", vulnerability_response)
        
        return {
            "complaints": complaints_response.data[0] if complaints_response.data else None,
            "vulnerability": vulnerability_response.data[0] if vulnerability_response.data else None
        }
    except Exception as e:
        print(f"Error storing assessment results: {str(e)}")
        raise Exception("Failed to store assessment results")