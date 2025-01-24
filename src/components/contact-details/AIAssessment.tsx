import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Accessibility } from "lucide-react";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
  hasPhysicalDisability: boolean;
}

export const AIAssessment = ({ complaints, vulnerabilities, hasPhysicalDisability }: AIAssessmentProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Assessment & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {/* Physical Disability Card */}
          <Card className="col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Accessibility className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-sm">Physical Disability Status</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-2">
                <Badge variant={hasPhysicalDisability ? "destructive" : "secondary"} className="text-sm">
                  {hasPhysicalDisability ? "Yes" : "No"}
                </Badge>
                <p className="text-sm text-gray-600 text-center">
                  {hasPhysicalDisability 
                    ? "Physical disability has been identified"
                    : "No physical disability reported"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Complaints Section */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Complaints</h3>
            <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="list-disc pl-4 space-y-2">
                {complaints.map((complaint, index) => (
                  <li key={index} className="text-sm text-gray-600">{complaint}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          {/* Vulnerabilities Section */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Vulnerabilities</h3>
            <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="list-disc pl-4 space-y-2">
                {vulnerabilities.map((vulnerability, index) => (
                  <li key={index} className="text-sm text-gray-600">{vulnerability}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};