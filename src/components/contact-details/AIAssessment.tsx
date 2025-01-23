import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
}

export const AIAssessment = ({ complaints, vulnerabilities }: AIAssessmentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assessment & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Complaints</h3>
            <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="list-disc pl-4 space-y-2">
                {complaints.map((complaint, index) => (
                  <li key={index} className="text-sm text-gray-600">{complaint}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div>
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