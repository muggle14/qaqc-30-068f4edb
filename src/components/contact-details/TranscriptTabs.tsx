
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptCard } from './TranscriptCard';
import { TranscriptReview } from './TranscriptReview';

interface TranscriptTabsProps {
  transcript: string;
  onTranscriptChange: (transcript: string) => void;
  isLoading?: boolean;
}

export const TranscriptTabs = ({ 
  transcript, 
  onTranscriptChange, 
  isLoading = false
}: TranscriptTabsProps) => {
  return (
    <Tabs defaultValue="original" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="original">Original Transcript</TabsTrigger>
        <TabsTrigger value="ai-review">Transcript Review (AI)</TabsTrigger>
      </TabsList>
      
      <TabsContent value="original" className="mt-0">
        <TranscriptCard 
          transcript={transcript} 
          onTranscriptChange={onTranscriptChange} 
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="ai-review" className="mt-0">
        <TranscriptReview />
      </TabsContent>
    </Tabs>
  );
};
