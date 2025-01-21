import { FileUpload } from "@/components/FileUpload";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Index = () => {
  // Query to fetch the latest upload details
  const { data: latestUpload } = useQuery({
    queryKey: ['latest-upload'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upload_details')
        .select('*')
        .order('upload_timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching latest upload:", error);
        throw error;
      }

      return data;
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Last Update:</span>
                <span>
                  {format(new Date(latestUpload.upload_timestamp), "PPpp")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;