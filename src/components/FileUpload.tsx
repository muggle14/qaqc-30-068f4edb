
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const fileType = file.name.toLowerCase();
      if (!fileType.endsWith('.csv') && !fileType.endsWith('.json')) {
        setError("Please upload a CSV or JSON file");
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV or JSON file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        let data: Array<{ contactId: string, evaluator: string }> = [];

        try {
          console.log("Processing file:", fileType);
          
          if (fileType.endsWith('.json')) {
            const parsedData = JSON.parse(text as string);
            data = parsedData.map((item: any) => ({
              contactId: item.contactId?.toString() || '',
              evaluator: item.evaluator?.toString() || '',
            })).filter(item => item.contactId && item.evaluator);
          } else {
            const rows = (text as string).split('\n').filter(row => row.trim());
            const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
            
            const contactIdIndex = headers.indexOf('contactid');
            const evaluatorIndex = headers.indexOf('evaluator');
            
            if (contactIdIndex === -1 || evaluatorIndex === -1) {
              throw new Error("CSV must contain 'contactId' and 'evaluator' columns");
            }

            data = rows.slice(1)
              .map(row => {
                const values = row.split(',').map(v => v.trim());
                return {
                  contactId: values[contactIdIndex]?.toString() || '',
                  evaluator: values[evaluatorIndex]?.toString() || '',
                };
              })
              .filter(item => item.contactId && item.evaluator);
          }

          if (data.length === 0) {
            throw new Error("No valid data found in file");
          }

          console.log("Parsed data:", data.length, "records");

          const response = await apiClient.invoke('upload-details', {
            data: data.map(item => ({
              contact_id: item.contactId,
              evaluator: item.evaluator,
              admin_id: null
            }))
          });

          if (!response.success) {
            console.error("Upload error:", response.error);
            throw new Error(response.error || "Failed to upload data");
          }

          console.log("Upload successful");
          toast({
            title: "Upload Successful",
            description: `Processed ${data.length} records`,
          });

          // Refresh the latest upload query
          queryClient.invalidateQueries({ queryKey: ['latest-upload'] });

        } catch (parseError) {
          console.error("Error processing file:", parseError);
          setError(parseError.message || "Error processing file. Please check the format.");
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: parseError.message || "Error processing file. Please check the format.",
          });
        }
      };

      reader.readAsText(file);

    } catch (error) {
      console.error("Upload error:", error);
      setError("Error uploading file. Please try again.");
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Error uploading file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        disabled={isUploading}
        className="w-full sm:w-auto"
      >
        {isUploading ? (
          <>
            <Upload className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FileUp className="h-4 w-4" />
            <label className="cursor-pointer">
              Upload File
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        )}
      </Button>
    </div>
  );
};
