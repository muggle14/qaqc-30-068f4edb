
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
import { Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface JoinedData {
  contact_id: string;
  evaluator: string;
  upload_timestamp: string;
  transcript: string | null;
  updated_at: string | null;
}

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user has admin access
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  useEffect(() => {
    if (!["admin2", "admin3"].includes(user.username)) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data: joinedData, isLoading } = useQuery({
    queryKey: ["joined-data"],
    queryFn: async () => {
      console.log("Fetching joined data...");
      const response = await apiClient.invoke('upload-details', {});
      
      if (!response.success) {
        console.error("Error fetching joined data:", response.error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
        throw new Error(response.error || "Failed to fetch data");
      }

      console.log("Raw joined data:", response.data);
      return response.data;
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
      <h1 className="text-2xl font-bold mb-6">Contact Records</h1>
      
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

export default Admin;
