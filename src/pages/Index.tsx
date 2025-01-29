import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ContactTable } from "@/components/contact-list/ContactTable";
import { TabNavigation } from "@/components/contact-list/TabNavigation";

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
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <TabsContent value="all-data">
          <ContactTable 
            data={sortedData}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
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