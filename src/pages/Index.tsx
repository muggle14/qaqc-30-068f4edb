import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

interface JoinedData {
  contact_id: string;
  evaluator: string;
  upload_timestamp: string;
  transcript: string | null;
  updated_at: string | null;
}

const Index = () => {
  const navigate = useNavigate();

  const { data: joinedData, isLoading } = useQuery({
    queryKey: ["joined-data"],
    queryFn: async () => {
      console.log("Fetching joined data...");
      const { data, error } = await supabase
        .from('upload_details')
        .select(`
          contact_id,
          evaluator,
          upload_timestamp,
          contact_conversations (
            transcript,
            updated_at
          )
        `);
      
      if (error) {
        console.error("Error fetching joined data:", error);
        throw error;
      }

      console.log("Raw joined data:", data);
      
      const transformedData: JoinedData[] = data.map(item => ({
        contact_id: item.contact_id,
        evaluator: item.evaluator,
        upload_timestamp: item.upload_timestamp,
        transcript: item.contact_conversations?.[0]?.transcript || null,
        updated_at: item.contact_conversations?.[0]?.updated_at || null,
      }));

      console.log("Transformed data:", transformedData);
      return transformedData;
    },
  });

  const handleRowClick = (contactId: string) => {
    console.log("Navigating to contact details:", contactId);
    navigate(`/contact/${contactId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Data Tab</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact ID</TableHead>
              <TableHead>Evaluator</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Transcript Preview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedData?.map((row) => (
              <TableRow 
                key={row.contact_id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  onClick={() => handleRowClick(row.contact_id)}
                >
                  {row.contact_id}
                  <ExternalLink className="h-4 w-4" />
                </TableCell>
                <TableCell>{row.evaluator}</TableCell>
                <TableCell>
                  {format(new Date(row.upload_timestamp), "PPp")}
                </TableCell>
                <TableCell>
                  {row.updated_at 
                    ? format(new Date(row.updated_at), "PPp")
                    : "Not updated"}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {row.transcript || "No transcript"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Index;