import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient } from "@/integrations/supabase/client";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { ContactFormHeader } from "@/components/contact-details/ContactFormHeader";
import { Save } from "lucide-react";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { getSummary, getVAndCAssessment } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { QualityAssessorSection } from "@/components/contact-details/QualityAssessorSection";

const Admin = () => {
  return <div>Admin Page Temporarily Disabled</div>;
};

export default Admin;
