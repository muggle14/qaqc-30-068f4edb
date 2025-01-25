from typing import Dict, Any, List, Optional
import json
import openai
from supabase import create_client, Client

def get_supabase_client() -> Client:
    url: str = "https://lbljwlbqmgaivwryxicg.supabase.co"
    key: str = "YOUR_SERVICE_ROLE_KEY"  # This will be replaced by the actual key in the environment
    return create_client(url, key)

def assess_complaints(transcript: str) -> Dict[str, Any]:
    try:
        # OpenAI call to assess complaints
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI trained to analyze customer service transcripts."},
                {"role": "user", "content": f"Analyze this transcript for any complaints: {transcript}"}
            ]
        )
        
        # Process the response
        analysis = response.choices[0].message.content
        has_complaints = "complaint" in analysis.lower()
        
        return {
            "has_complaints": has_complaints,
            "reasoning": analysis
        }
    except Exception as e:
        print(f"Error in assess_complaints: {str(e)}")
        return {
            "has_complaints": False,
            "reasoning": "Error analyzing complaints"
        }

def assess_vulnerability(transcript: str) -> Dict[str, Any]:
    try:
        # OpenAI call to assess vulnerability
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI trained to identify customer vulnerabilities."},
                {"role": "user", "content": f"Analyze this transcript for signs of vulnerability: {transcript}"}
            ]
        )
        
        # Process the response
        analysis = response.choices[0].message.content
        is_vulnerable = "vulnerable" in analysis.lower()
        
        return {
            "is_vulnerable": is_vulnerable,
            "reasoning": analysis
        }
    except Exception as e:
        print(f"Error in assess_vulnerability: {str(e)}")
        return {
            "is_vulnerable": False,
            "reasoning": "Error analyzing vulnerability"
        }

def store_assessment_results(
    supabase: Client,
    contact_id: str,
    complaints_result: Dict[str, Any],
    vulnerability_result: Dict[str, Any]
) -> Dict[str, Any]:
    try:
        # Store complaints assessment
        complaints_data = {
            "contact_id": contact_id,
            "complaints_flag": complaints_result["has_complaints"],
            "complaints_reasoning": complaints_result["reasoning"]
        }
        
        complaints_response = supabase.table("ai_assess_complaints").insert(complaints_data).execute()
        
        # Store vulnerability assessment
        vulnerability_data = {
            "contact_id": contact_id,
            "vulnerability_flag": vulnerability_result["is_vulnerable"],
            "vulnerability_reasoning": vulnerability_result["reasoning"]
        }
        
        vulnerability_response = supabase.table("ai_assess_vulnerability").insert(vulnerability_data).execute()
        
        return {
            "complaints": complaints_response.data,
            "vulnerability": vulnerability_response.data
        }
    except Exception as e:
        print(f"Error storing assessment results: {str(e)}")
        raise Exception("Failed to store assessment results")