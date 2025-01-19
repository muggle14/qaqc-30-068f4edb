import { useState } from "react";
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

interface ContactData {
  contactId: string;
  status: "reviewed" | "not_reviewed";
  queueDetails: string;
  timestamp: string;
}

const Admin = () => {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user has admin access
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!["admin2", "admin3"].includes(user.username)) {
    navigate("/");
    return null;
  }

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Queue Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.contactId}>
                <TableCell>{contact.contactId}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      contact.status === "reviewed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell>{contact.queueDetails}</TableCell>
                <TableCell>{contact.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;