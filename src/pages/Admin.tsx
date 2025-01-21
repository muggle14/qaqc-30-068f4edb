import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ContactData {
  contactId: string;
  status: "reviewed" | "not_reviewed";
  queueDetails: string;
  timestamp: string;
}

interface CombinedContactData {
  contact_id: string;
  evaluator: string;
  upload_timestamp: string;
  transcript: string | null;
  updated_at: string | null;
}

const Admin = () => {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [combinedData, setCombinedData] = useState<CombinedContactData[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user has admin access
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!["admin2", "admin3"].includes(user.username)) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        console.log("Fetching combined data...");
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
          console.error("Error fetching combined data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch contact data",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched combined data:", data);
        
        // Transform the data to flatten the structure
        const transformedData = data.map(item => ({
          contact_id: item.contact_id,
          evaluator: item.evaluator,
          upload_timestamp: item.upload_timestamp,
          transcript: item.contact_conversations?.[0]?.transcript || null,
          updated_at: item.contact_conversations?.[0]?.updated_at || null,
        }));

        setCombinedData(transformedData);
      } catch (error) {
        console.error("Error in fetchCombinedData:", error);
      }
    };

    fetchCombinedData();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV or JSON file",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        let data: ContactData[] = [];

        if (file.name.endsWith('.json')) {
          data = JSON.parse(text as string);
        } else {
          // Basic CSV parsing (you might want to use a CSV parser library for production)
          const rows = (text as string).split('\n');
          const headers = rows[0].split(',');
          
          data = rows.slice(1).map(row => {
            const values = row.split(',');
            return {
              contactId: values[0],
              status: values[1] as "reviewed" | "not_reviewed",
              queueDetails: values[2],
              timestamp: values[3],
            };
          });
        }

        setContacts(data);
        toast({
          title: "File Uploaded Successfully",
          description: `Loaded ${data.length} contacts`,
        });
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error Processing File",
        description: "There was an error processing your file",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (contactId: string) => {
    console.log("Navigating to contact details:", contactId);
    navigate(`/contact/${contactId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          <label className="cursor-pointer">
            Upload File
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      <div className="rounded-md border">
        <h2 className="text-xl font-semibold p-4">Contact Records</h2>
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
            {combinedData.map((contact) => (
              <TableRow 
                key={contact.contact_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(contact.contact_id)}
              >
                <TableCell>{contact.contact_id}</TableCell>
                <TableCell>{contact.evaluator}</TableCell>
                <TableCell>
                  {format(new Date(contact.upload_timestamp), "PPp")}
                </TableCell>
                <TableCell>
                  {contact.updated_at 
                    ? format(new Date(contact.updated_at), "PPp")
                    : "Not updated"}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {contact.transcript || "No transcript"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;
