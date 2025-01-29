import { useState } from "react";
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
import { ExternalLink, ArrowUpDown, Eye, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JoinedData {
  contact_id: string;
  evaluator: string;
  upload_timestamp: string;
  transcript: string | null;
  updated_at: string | null;
}

type SortField = 'upload_timestamp' | 'updated_at';
type SortOrder = 'asc' | 'desc';

const Index = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('upload_timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeTab, setActiveTab] = useState("all-data");

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = joinedData ? [...joinedData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;

    const comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  }) : [];

  const handleRowClick = (contactData: JoinedData) => {
    console.log("Navigating to contact details with state:", contactData);
    navigate('/contact/view', { 
      state: { contactData },
      replace: true 
    });
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Management</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Main Page
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              const tabs = ["all-data", "pending", "completed"];
              const currentIndex = tabs.indexOf(activeTab);
              const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
              setActiveTab(tabs[prevIndex]);
            }}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <TabsList className="flex-1">
            <TabsTrigger value="all-data" className="flex-1">All Data</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
          </TabsList>
          
          <Button
            variant="ghost"
            onClick={() => {
              const tabs = ["all-data", "pending", "completed"];
              const currentIndex = tabs.indexOf(activeTab);
              const nextIndex = (currentIndex + 1) % tabs.length;
              setActiveTab(tabs[nextIndex]);
            }}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="all-data">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact ID</TableHead>
                  <TableHead>Evaluator</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('upload_timestamp')}
                      className="h-8 flex items-center gap-1"
                    >
                      Upload Date
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('updated_at')}
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
                {sortedData.map((row) => (
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
        </TabsContent>

        <TabsContent value="pending">
          <div className="p-4 text-center text-gray-500">
            Pending items will be shown here
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="p-4 text-center text-gray-500">
            Completed items will be shown here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;