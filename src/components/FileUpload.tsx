import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      setError("Please upload a CSV or JSON file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      const adminId = user.data.user?.id;

      if (!adminId) {
        throw new Error("User not authenticated");
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        let data: Array<{ contactId: string, evaluator: string }> = [];

        try {
          if (file.name.endsWith('.json')) {
            data = JSON.parse(text as string);
          } else {
            // Basic CSV parsing
            const rows = (text as string).split('\n');
            const headers = rows[0].split(',');
            
            data = rows.slice(1).map(row => {
              const values = row.split(',');
              return {
                contactId: values[0],
                evaluator: values[1],
              };
            });
          }

          // Insert data into Supabase
          const { error: uploadError } = await supabase
            .from('upload_details')
            .insert(data.map(item => ({
              contact_id: item.contactId,
              evaluator: item.evaluator,
              admin_id: adminId,
            })));

          if (uploadError) throw uploadError;

          toast({
            title: "Upload Successful",
            description: `Processed ${data.length} records`,
          });

        } catch (parseError) {
          console.error("Error processing file:", parseError);
          setError("Error processing file. Please check the format.");
        }
      };

      reader.readAsText(file);

    } catch (error) {
      console.error("Upload error:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        disabled={isUploading}
        className="gap-2"
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