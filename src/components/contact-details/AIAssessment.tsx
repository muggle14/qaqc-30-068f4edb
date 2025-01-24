import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Accessibility, AlertCircle, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
  hasPhysicalDisability: boolean;
  contactId: string;
}

export const AIAssessment = ({ complaints, vulnerabilities, hasPhysicalDisability, contactId }: AIAssessmentProps) => {
  const { data: aiAssessment } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      console.log("Fetching AI assessment for contact:", contactId);
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('ai_assess_complaints')
        .select('*')
        .eq('contact_id', contactId)
        .maybeSingle();

      if (complaintsError) {
        console.error("Error fetching complaints assessment:", complaintsError);
        throw complaintsError;
      }

      const { data: vulnerabilityData, error: vulnerabilityError } = await supabase
        .from('ai_assess_vulnerability')
        .select('*')
        .eq('contact_id', contactId)
        .maybeSingle();

      if (vulnerabilityError) {
        console.error("Error fetching vulnerability assessment:", vulnerabilityError);
        throw vulnerabilityError;
      }

      console.log("AI assessment data:", { complaintsData, vulnerabilityData });
      return {
        ...complaintsData,
        vulnerability_flag: vulnerabilityData?.vulnerability_flag || false,
        vulnerability_reasoning: vulnerabilityData?.vulnerability_reasoning
      };
    }
  });

  // Determine if both flags are true for conditional coloring
  const bothFlagsTrue = aiAssessment?.complaints_flag && aiAssessment?.vulnerability_flag;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assessment & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Physical Disability Card - Full width */}
          <Card className="h-auto w-full border-2 border-gray-200 p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Accessibility className="h-5 w-5 text-gray-500" />
                  <h3 className="font-semibold text-lg">Physical Disability Status</h3>
                </div>
                <Badge 
                  variant={aiAssessment?.physical_disability_flag ? "destructive" : "secondary"} 
                  className="text-sm"
                >
                  {aiAssessment?.physical_disability_flag ? "Yes" : "No"}
                </Badge>
              </div>
              {aiAssessment?.physical_disability_reasoning && (
                <p className="text-sm text-gray-600 mt-2">
                  {aiAssessment.physical_disability_reasoning}
                </p>
              )}
            </div>
          </Card>

          {/* Complaints and Vulnerabilities in a grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Complaints Section */}
            <Card className="border-2 border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-lg">Complaints:</h3>
                    <Badge 
                      variant={aiAssessment?.complaints_flag ? "destructive" : "secondary"}
                      className={`text-lg font-semibold ${bothFlagsTrue ? 'bg-red-500' : ''}`}
                    >
                      {aiAssessment?.complaints_flag ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                {aiAssessment?.complaints_reasoning && (
                  <p className="text-sm text-gray-600">
                    {aiAssessment.complaints_reasoning}
                  </p>
                )}
                <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <ul className="list-disc pl-4 space-y-2">
                    {complaints.map((complaint, index) => (
                      <li key={index} className="text-sm text-gray-600">{complaint}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </Card>

            {/* Vulnerabilities Section */}
            <Card className="border-2 border-gray-200 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold text-lg">Vulnerabilities:</h3>
                    <Badge 
                      variant={aiAssessment?.vulnerability_flag ? "destructive" : "secondary"}
                      className={`text-lg font-semibold ${bothFlagsTrue ? 'bg-red-500' : ''}`}
                    >
                      {aiAssessment?.vulnerability_flag ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                {aiAssessment?.vulnerability_reasoning && (
                  <p className="text-sm text-gray-600">
                    {aiAssessment.vulnerability_reasoning}
                  </p>
                )}
                <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <ul className="list-disc pl-4 space-y-2">
                    {vulnerabilities.map((vulnerability, index) => (
                      <li key={index} className="text-sm text-gray-600">{vulnerability}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};