
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Tag,
  Eye,
  EyeOff,
  X,
  CheckSquare,
} from 'lucide-react';

// Sample transcript data
const sampleTranscript = {
  snippets: [
    {
      id: "a1b2c3d4e5f6g7h8i9j0k1l2",
      speaker: "TBC 0",
      text: "There is a day."
    },
    {
      id: "b3c4d5e6f7g8h9i0j1k2l3m4",
      speaker: "TBC 1",
      text: "About ten years ago when I asked a friend to hold a baby dinosaur robot upside down."
    },
    {
      id: "c5d6e7f8g9h0i1j2k3l4m5n6",
      speaker: "TBC 2",
      text: "It was a toy called plea."
    },
    {
      id: "d7e8f9g0h1i2j3k4l5m6n7o8",
      speaker: "TBC 3",
      text: "All that he'd ordered and I was really excited about it because I've always loved about this one has really caught technical features."
    },
    {
      id: "e9f0g1h2i3j4k5l6m7n8o9p0",
      speaker: "TBC 4",
      text: "It had more orders and touch sensors."
    },
    {
      id: "f1g2h3i4j5k6l7m8n9o0p1q2",
      speaker: "TBC 5",
      text: "It had an infrared camera and one of the things that had was a tilt sensor so it."
    },
    {
      id: "g3h4i5j6k7l8m9n0o1p2q3r4",
      speaker: "TBC 6",
      text: "Knew what direction."
    },
    {
      id: "h5i6j7k8l9m0n1o2p3q4r5s6",
      speaker: "TBC 7",
      text: "It was facing."
    }
  ]
};

type EmotionCategory = 'Excited' | 'Curious' | 'Nostalgic' | 'Upset' | 'Vulnerable' | null;

interface SnippetComment {
  snippetIds: string[];
  comment: string;
  id: string;
}

interface EmotionHighlight {
  snippetId: string;
  emotion: EmotionCategory;
}

export const TranscriptReview = () => {
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([]);
  const [showIds, setShowIds] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<SnippetComment[]>([]);
  const [emotionHighlights, setEmotionHighlights] = useState<EmotionHighlight[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCategory>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EmotionCategory>(null);

  const toggleSnippet = (snippetId: string) => {
    if (selectedSnippets.includes(snippetId)) {
      setSelectedSnippets(selectedSnippets.filter(id => id !== snippetId));
    } else {
      setSelectedSnippets([...selectedSnippets, snippetId]);
    }
  };

  const handleCommentSubmit = () => {
    if (selectedSnippets.length > 0 && commentText.trim() !== '') {
      const newComment: SnippetComment = {
        snippetIds: [...selectedSnippets],
        comment: commentText,
        id: `comment-${Date.now()}`
      };
      setComments([...comments, newComment]);
      setCommentText('');
      setIsCommentDialogOpen(false);
    }
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const applyEmotionToSelected = (emotion: EmotionCategory) => {
    if (!emotion || selectedSnippets.length === 0) return;

    const updatedHighlights = [...emotionHighlights];
    
    selectedSnippets.forEach(snippetId => {
      const existingIndex = updatedHighlights.findIndex(h => h.snippetId === snippetId);
      
      if (existingIndex >= 0) {
        updatedHighlights[existingIndex].emotion = emotion;
      } else {
        updatedHighlights.push({ snippetId, emotion });
      }
    });
    
    setEmotionHighlights(updatedHighlights);
    setIsTagDialogOpen(false);
  };

  const getEmotionColor = (snippetId: string) => {
    const highlight = emotionHighlights.find(h => h.snippetId === snippetId);
    if (!highlight) return '';

    switch (highlight.emotion) {
      case 'Excited':
        return 'bg-yellow-100 border-yellow-300';
      case 'Curious':
        return 'bg-blue-100 border-blue-300';
      case 'Nostalgic':
        return 'bg-purple-100 border-purple-300';
      case 'Upset':
        return 'bg-red-100 border-red-300';
      case 'Vulnerable':
        return 'bg-green-100 border-green-300';
      default:
        return '';
    }
  };

  const getEmotionBadge = (emotion: EmotionCategory) => {
    switch (emotion) {
      case 'Excited':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Excited</Badge>;
      case 'Curious':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Curious</Badge>;
      case 'Nostalgic':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Nostalgic</Badge>;
      case 'Upset':
        return <Badge className="bg-red-500 hover:bg-red-600">Upset</Badge>;
      case 'Vulnerable':
        return <Badge className="bg-green-500 hover:bg-green-600">Vulnerable</Badge>;
      default:
        return null;
    }
  };

  const getSnippetComments = (snippetId: string) => {
    return comments.filter(comment => comment.snippetIds.includes(snippetId));
  };

  const getSpeakerRole = (index: number) => {
    return index % 2 === 0 ? "Agent" : "Customer";
  };

  const filterByEmotion = (snippets: typeof sampleTranscript.snippets) => {
    if (!activeFilter) return snippets;
    
    return snippets.filter(snippet => {
      const highlight = emotionHighlights.find(h => h.snippetId === snippet.id);
      return highlight && highlight.emotion === activeFilter;
    });
  };

  const displayedSnippets = filterByEmotion(sampleTranscript.snippets);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transcript Review (AI)</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
            className={`flex items-center gap-1 ${isMultiSelectMode ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <CheckSquare className="h-4 w-4" />
            {isMultiSelectMode ? 'Exit Select' : 'Select Snippets'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowIds(!showIds)}
            className="flex items-center gap-1"
          >
            {showIds ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showIds ? 'Hide IDs' : 'Show IDs'}
          </Button>
          
          {isMultiSelectMode && selectedSnippets.length > 0 && (
            <>
              <Button
                size="sm"
                onClick={() => setIsTagDialogOpen(true)}
                className="flex items-center gap-1"
                variant="outline"
              >
                <Tag className="h-4 w-4" /> Tag Selected
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCommentDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" /> Comment
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Emotion filters */}
      <div className="flex flex-wrap gap-1">
        {(['Excited', 'Curious', 'Nostalgic', 'Upset', 'Vulnerable'] as EmotionCategory[]).map(emotion => (
          <Button
            key={emotion}
            size="sm"
            variant="outline"
            className={`text-xs ${activeFilter === emotion ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setActiveFilter(activeFilter === emotion ? null : emotion)}
          >
            {getEmotionBadge(emotion)}
          </Button>
        ))}
        {activeFilter && (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setActiveFilter(null)}
          >
            Clear Filter
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="py-2">
              {displayedSnippets.map((snippet, index) => {
                const isSelected = selectedSnippets.includes(snippet.id);
                const emotionClass = getEmotionColor(snippet.id);
                const snippetComments = getSnippetComments(snippet.id);
                const speakerRole = getSpeakerRole(index);
                const emotion = emotionHighlights.find(h => h.snippetId === snippet.id)?.emotion;

                return (
                  <div key={snippet.id} className="group">
                    <div 
                      className={`px-3 py-1.5 ${emotionClass || ''} hover:bg-gray-100 transition-colors`}
                    >
                      <div className="flex gap-2">
                        {isMultiSelectMode && (
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleSnippet(snippet.id)}
                            className="mt-1"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-baseline">
                            <span className={`font-medium text-sm ${speakerRole === 'Agent' ? 'text-blue-600' : 'text-green-600'} mr-2`}>
                              {speakerRole}:
                            </span>
                            <span 
                              className="text-sm text-gray-800"
                              onClick={() => isMultiSelectMode && toggleSnippet(snippet.id)}
                            >
                              {snippet.text}
                            </span>
                            
                            {emotion && (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="ml-2 inline-block">
                                    {getEmotionBadge(emotion)}
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto">
                                  <p className="text-xs">{emotion} response detected</p>
                                </HoverCardContent>
                              </HoverCard>
                            )}
                          </div>
                          
                          {showIds && (
                            <p className="text-xs text-gray-400 mt-1 font-mono">ID: {snippet.id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {snippetComments.length > 0 && (
                      <div className="pl-8 space-y-1 mb-1">
                        {snippetComments.map(comment => (
                          <div 
                            key={comment.id} 
                            className="bg-gray-100 p-1.5 rounded border-l-2 border-primary flex items-start justify-between text-xs"
                          >
                            <p>{comment.comment}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0"
                              onClick={() => deleteComment(comment.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {displayedSnippets.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No snippets match the selected filter
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Adding comment to {selectedSnippets.length} selected snippet{selectedSnippets.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCommentSubmit} disabled={commentText.trim() === ''}>
              Save Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tag Selected Snippets</DialogTitle>
            <DialogDescription>
              Choose an emotion tag for {selectedSnippets.length} selected snippet{selectedSnippets.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 grid grid-cols-2 gap-2">
            {(['Excited', 'Curious', 'Nostalgic', 'Upset', 'Vulnerable'] as EmotionCategory[]).map(emotion => (
              <Button
                key={emotion}
                variant="outline"
                className="justify-start"
                onClick={() => applyEmotionToSelected(emotion)}
              >
                {getEmotionBadge(emotion)}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
