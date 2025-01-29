import { format } from "date-fns";
import { ExternalLink, ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface JoinedData {
  contact_id: string;
  evaluator: string;
  upload_timestamp: string;
  transcript: string | null;
  updated_at: string | null;
}

interface ContactTableProps {
  data: JoinedData[];
  sortField: 'upload_timestamp' | 'updated_at';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'upload_timestamp' | 'updated_at') => void;
}

export const ContactTable = ({ data, sortField, sortOrder, onSort }: ContactTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (contactData: JoinedData) => {
    console.log("Navigating to contact details with state:", contactData);
    navigate('/contact/view', { 
      state: { contactData },
      replace: true 
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact ID</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('upload_timestamp')}
                className="h-8 flex items-center gap-1"
              >
                Upload Date
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('updated_at')}
                className="h-8 flex items-center gap-1"
              >
                Last Updated
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Transcript Preview</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row.contact_id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                onClick={() => handleRowClick(row)}
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
              <TableCell className="max-w-md">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between px-2 gap-2 h-8 hover:bg-gray-100"
                    >
                      <span className="truncate">
                        {row.transcript || "No transcript"}
                      </span>
                      <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-4">
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="text-sm whitespace-pre-wrap">
                        {row.transcript || "No transcript available"}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};