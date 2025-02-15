
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Session storage keys
export const STORAGE_KEYS = {
  CONTACT_ID: 'manual_contact_id',
  EVALUATOR: 'manual_evaluator',
  TRANSCRIPT: 'manual_transcript',
  SPECIAL_SERVICE: 'manual_special_service',
  SUMMARY: 'manual_summary',
  SUMMARY_POINTS: 'manual_summary_points',
} as const;

export interface ContactFormData {
  contactId: string;
  evaluator: string;
  transcript: string;
  isSpecialServiceTeam: "yes" | "no";
  overallSummary: string;
  detailedSummaryPoints: string[];
}

export const useSessionStorage = () => {
  const { toast } = useToast();
  
  const loadFromStorage = (): ContactFormData => {
    try {
      const storedContactId = sessionStorage.getItem(STORAGE_KEYS.CONTACT_ID) || "";
      const storedEvaluator = sessionStorage.getItem(STORAGE_KEYS.EVALUATOR) || "";
      const storedTranscript = sessionStorage.getItem(STORAGE_KEYS.TRANSCRIPT) || "";
      const storedSpecialService = sessionStorage.getItem(STORAGE_KEYS.SPECIAL_SERVICE) as "yes" | "no" || "no";
      const storedSummary = sessionStorage.getItem(STORAGE_KEYS.SUMMARY) || "No summary available yet";
      const storedSummaryPoints = sessionStorage.getItem(STORAGE_KEYS.SUMMARY_POINTS);

      return {
        contactId: storedContactId,
        evaluator: storedEvaluator,
        transcript: storedTranscript,
        isSpecialServiceTeam: storedSpecialService,
        overallSummary: storedSummary,
        detailedSummaryPoints: storedSummaryPoints ? JSON.parse(storedSummaryPoints) : [],
      };
    } catch (error) {
      console.error('Error loading from session storage:', error);
      toast({
        title: "Warning",
        description: "Failed to load saved data. Your changes may not be preserved.",
        variant: "destructive",
      });
      return {
        contactId: "",
        evaluator: "",
        transcript: "",
        isSpecialServiceTeam: "no",
        overallSummary: "No summary available yet",
        detailedSummaryPoints: [],
      };
    }
  };

  const saveToStorage = (data: ContactFormData) => {
    try {
      if (data.contactId) sessionStorage.setItem(STORAGE_KEYS.CONTACT_ID, data.contactId);
      if (data.evaluator) sessionStorage.setItem(STORAGE_KEYS.EVALUATOR, data.evaluator);
      if (data.transcript) sessionStorage.setItem(STORAGE_KEYS.TRANSCRIPT, data.transcript);
      sessionStorage.setItem(STORAGE_KEYS.SPECIAL_SERVICE, data.isSpecialServiceTeam);
      if (data.overallSummary !== "No summary available yet") {
        sessionStorage.setItem(STORAGE_KEYS.SUMMARY, data.overallSummary);
      }
      if (data.detailedSummaryPoints.length > 0) {
        sessionStorage.setItem(STORAGE_KEYS.SUMMARY_POINTS, JSON.stringify(data.detailedSummaryPoints));
      }
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  };

  const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
  };

  return { loadFromStorage, saveToStorage, clearStorage };
};
