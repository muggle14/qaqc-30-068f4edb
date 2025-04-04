
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
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

type EmotionCategory = 'Excited' | 'Curious' | 'Nostalgic' | null;

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

  const toggleEmotionHighlight = (snippetId: string) => {
    if (!selectedEmotion) return;

    const existingHighlightIndex = emotionHighlights.findIndex(
      highlight => highlight.snippetId === snippetId
    );

    if (existingHighlightIndex >= 0) {
      // If the snippet already has the same emotion, remove it
      if (emotionHighlights[existingHighlightIndex].emotion === selectedEmotion) {
        setEmotionHighlights(
          emotionHighlights.filter(highlight => highlight.snippetId !== snippetId)
        );
      } else {
        // If the snippet has a different emotion, update it
        const updatedHighlights = [...emotionHighlights];
        updatedHighlights[existingHighlightIndex].emotion = selectedEmotion;
        setEmotionHighlights(updatedHighlights);
      }
    } else {
      // If the snippet has no emotion yet, add it
      setEmotionHighlights([
        ...emotionHighlights,
        { snippetId, emotion: selectedEmotion }
      ]);
    }
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
      default:
        return '';
    }
  };

  const getSnippetComments = (snippetId: string) => {
    return comments.filter(comment => comment.snippetIds.includes(snippetId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Transcript Review (AI)</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowIds(!showIds)}
              className="flex items-center gap-1"
            >
              {showIds ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showIds ? 'Hide IDs' : 'Show IDs'}
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">Emotion:</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={selectedEmotion === 'Excited' ? 'default' : 'outline'}
                className={selectedEmotion === 'Excited' ? 'bg-yellow-500' : ''}
                onClick={() => setSelectedEmotion(selectedEmotion === 'Excited' ? null : 'Excited')}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />Excited
              </Button>
              <Button
                size="sm"
                variant={selectedEmotion === 'Curious' ? 'default' : 'outline'}
                className={selectedEmotion === 'Curious' ? 'bg-blue-500' : ''}
                onClick={() => setSelectedEmotion(selectedEmotion === 'Curious' ? null : 'Curious')}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />Curious
              </Button>
              <Button
                size="sm"
                variant={selectedEmotion === 'Nostalgic' ? 'default' : 'outline'}
                className={selectedEmotion === 'Nostalgic' ? 'bg-purple-500' : ''}
                onClick={() => setSelectedEmotion(selectedEmotion === 'Nostalgic' ? null : 'Nostalgic')}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />Nostalgic
              </Button>
            </div>
          </div>
          <Button
            onClick={() => setIsCommentDialogOpen(true)}
            disabled={selectedSnippets.length === 0}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" /> Comment
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] pr-4">
            <div className="p-4 space-y-1">
              {sampleTranscript.snippets.map((snippet, index) => {
                const isSelected = selectedSnippets.includes(snippet.id);
                const emotionClass = getEmotionColor(snippet.id);
                const snippetComments = getSnippetComments(snippet.id);
                const isEven = index % 2 === 0;

                return (
                  <div key={snippet.id} className="space-y-1">
                    <div 
                      className={`p-3 rounded-md border transition-colors
                        ${emotionClass || (isEven ? 'bg-gray-50' : 'bg-blue-50')}
                        ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex gap-2">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleSnippet(snippet.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm text-gray-600">{snippet.speaker}</span>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 w-5 p-0"
                                onClick={() => toggleEmotionHighlight(snippet.id)}
                              >
                                <Tag className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p 
                            className="text-gray-800 my-1" 
                            onClick={() => toggleSnippet(snippet.id)}
                          >
                            {snippet.text}
                          </p>
                          {showIds && (
                            <p className="text-xs text-gray-400 mt-1 font-mono">ID: {snippet.id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {snippetComments.length > 0 && (
                      <div className="pl-8 space-y-2 mt-1">
                        {snippetComments.map(comment => (
                          <div 
                            key={comment.id} 
                            className="bg-gray-100 p-2 rounded-md border-l-4 border-primary flex items-start justify-between"
                          >
                            <p className="text-sm">{comment.comment}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => deleteComment(comment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

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
    </div>
  );
};
