import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailedSummaryProps {
  summaryPoints: string[];
}

export const DetailedSummary = ({ summaryPoints }: DetailedSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-52rem)] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="list-disc pl-4 space-y-2">
            {summaryPoints.map((point, index) => (
              <li key={index} className="text-sm text-gray-600">{point}</li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};