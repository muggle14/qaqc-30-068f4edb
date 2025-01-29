import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const handleTabChange = (direction: 'prev' | 'next') => {
    const tabs = ["all-data", "pending", "completed"];
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + tabs.length) % tabs.length
      : (currentIndex + 1) % tabs.length;
    onTabChange(tabs[newIndex]);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="ghost"
        onClick={() => handleTabChange('prev')}
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
        onClick={() => handleTabChange('next')}
        className="p-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};