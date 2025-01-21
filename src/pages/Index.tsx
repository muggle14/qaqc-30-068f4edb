import { FileUpload } from "@/components/FileUpload";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Index = () => {
  // Query to fetch the latest upload details and statistics
  const { data: latestUpload } = useQuery({
    queryKey: ['latest-upload'],
    queryFn: async () => {
      // Fetch the latest upload timestamp
      const { data: latest, error: latestError } = await supabase
        .from('upload_details')
        .select('*')
        .order('upload_timestamp', { ascending: false })
        .limit(1)
        .single();

      if (latestError) {
        console.error("Error fetching latest upload:", latestError);
        throw latestError;
      }

      if (!latest) return null;

      // Fetch all records from the latest upload
      const { data: records, error: recordsError } = await supabase
        .from('upload_details')
        .select('*')
        .eq('upload_timestamp', latest.upload_timestamp);

      if (recordsError) {
        console.error("Error fetching upload records:", recordsError);
        throw recordsError;
      }

      // Calculate evaluator statistics
      const evaluatorStats = records.reduce((acc, curr) => {
        acc[curr.evaluator] = (acc[curr.evaluator] || 0) + 1;
        return acc;
      }, {});

      return {
        ...latest,
        totalRecords: records.length,
        evaluatorStats
      };
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-tool-primary mb-8 text-center">Admin Access</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">Upload Contact Details</h2>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      {latestUpload && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold">Latest Update Details</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Last Update:</span>
                  <span className="ml-2">
                    {format(new Date(latestUpload.upload_timestamp), "PPpp")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Uploaded by:</span>
                  <span className="ml-2">
                    {latestUpload.admin_id || 'System Upload'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total Records:</span>
                  <span className="ml-2">{latestUpload.totalRecords}</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Records by Evaluator</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evaluator</TableHead>
                      <TableHead className="text-right">Number of Records</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(latestUpload.evaluatorStats).map(([evaluator, count]) => (
                      <TableRow key={evaluator}>
                        <TableCell>{evaluator}</TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;