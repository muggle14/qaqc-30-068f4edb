
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  CheckSquare,
  MessageSquare,
  Tag,
  HelpCircle,
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

type EmotionCategory = 'Sarcasm' | 'Panic' | 'Anxiety' | null;

interface SnippetComment {
  snippetIds: string[];
  comment: string;
  id: string;
}

interface SnippetTag {
  snippetIds: string[];
  tag: string;
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
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [tagText, setTagText] = useState('');
  const [comments, setComments] = useState<SnippetComment[]>([]);
  const [emotionHighlights, setEmotionHighlights] = useState<EmotionHighlight[]>([]);
  const [tags, setTags] = useState<SnippetTag[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  // Auto-dismiss tag dialog after inactivity
  useEffect(() => {
    if (isTagDialogOpen) {
      const timer = setTimeout(() => {
        setIsTagDialogOpen(false);
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isTagDialogOpen, tagText]);
  
  // Auto-dismiss help drawer after inactivity
  useEffect(() => {
    if (isHelpDrawerOpen) {
      const timer = setTimeout(() => {
        setIsHelpDrawerOpen(false);
      }, 7000); // 7 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isHelpDrawerOpen]);

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

  const handleTagSubmit = () => {
    if (selectedSnippets.length > 0 && tagText.trim() !== '') {
      const newTag: SnippetTag = {
        snippetIds: [...selectedSnippets],
        tag: tagText,
        id: `tag-${Date.now()}`
      };
      setTags([...tags, newTag]);
      setTagText('');
      setIsTagDialogOpen(false);
    }
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
  };

  const clearSelection = () => {
    setSelectedSnippets([]);
  };

  const deleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const deleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const getEmotionBadge = (snippetId: string) => {
    const highlight = emotionHighlights.find(h => h.snippetId === snippetId);
    if (!highlight) return null;

    switch (highlight.emotion) {
      case 'Sarcasm':
        return <Badge className="bg-yellow-200 text-yellow-800">Sarcasm</Badge>;
      case 'Panic':
        return <Badge className="bg-red-200 text-red-800">Panic</Badge>;
      case 'Anxiety':
        return <Badge className="bg-blue-200 text-blue-800">Anxiety</Badge>;
      default:
        return null;
    }
  };

  const getSnippetComments = (snippetId: string) => {
    return comments.filter(comment => comment.snippetIds.includes(snippetId));
  };

  const getSnippetTags = (snippetId: string) => {
    return tags.filter(tag => tag.snippetIds.includes(snippetId));
  };

  const getSpeakerRole = (index: number) => {
    return index % 2 === 0 ? "Agent" : "Customer";
  };

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
            {isMultiSelectMode ? 'Exit Selection' : 'Select Snippets'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsHelpDrawerOpen(true)}
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-4 w-4" /> Legend
          </Button>
        </div>
      </div>
      
      {/* Selection Action Bar - Only visible when in multi-select mode and snippets are selected */}
      {isMultiSelectMode && selectedSnippets.length > 0 && (
        <div className="bg-secondary/30 rounded-md p-2 flex items-center gap-2 shadow-sm">
          <span className="text-sm font-medium">{selectedSnippets.length} selected</span>
          <div className="flex-1"></div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTagDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Tag className="h-4 w-4" /> Add Tag
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCommentDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" /> Add Comment
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearSelection}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Clear Selection
          </Button>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="py-2">
              {sampleTranscript.snippets.map((snippet, index) => {
                const isSelected = selectedSnippets.includes(snippet.id);
                const snippetComments = getSnippetComments(snippet.id);
                const snippetTags = getSnippetTags(snippet.id);
                const speakerRole = getSpeakerRole(index);

                return (
                  <div 
                    key={snippet.id} 
                    className={`group border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div 
                      className={`p-3 hover:bg-gray-100 transition-colors rounded-md shadow-sm my-1.5 mx-1 relative ${
                        isSelected ? 'ring-2 ring-primary ring-inset' : ''
                      }`}
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
                            <span className={`font-medium text-sm ${speakerRole === 'Agent' ? 'text-[#2563EB]' : 'text-[#16A34A]'} mr-2`}>
                              {speakerRole}:
                            </span>
                            <span 
                              className="text-sm text-gray-800"
                              onClick={() => isMultiSelectMode && toggleSnippet(snippet.id)}
                            >
                              {snippet.text}
                            </span>
                          </div>
                          
                          {showIds && (
                            <p className="text-xs text-gray-400 mt-1 font-mono">ID: {snippet.id}</p>
                          )}
                        </div>

                        {/* Emotion Badge in top-right corner */}
                        <div className="absolute top-2 right-2">
                          {getEmotionBadge(snippet.id)}
                          
                          {/* Tag icon button */}
                          {!isMultiSelectMode && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Tag className="h-3.5 w-3.5 text-gray-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent side="right" align="start" className="p-2 w-52">
                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Add Tag</p>
                                  <Input 
                                    placeholder="Enter tag name" 
                                    className="h-7 text-xs"
                                    value={tagText}
                                    onChange={(e) => setTagText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && tagText) {
                                        const newTag: SnippetTag = {
                                          snippetIds: [snippet.id],
                                          tag: tagText,
                                          id: `tag-${Date.now()}`
                                        };
                                        setTags([...tags, newTag]);
                                        setTagText('');
                                      }
                                    }}
                                  />
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-6 text-xs px-2"
                                      onClick={() => {
                                        const newTag: SnippetTag = {
                                          snippetIds: [snippet.id],
                                          tag: "needs-followup",
                                          id: `tag-${Date.now()}`
                                        };
                                        setTags([...tags, newTag]);
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />needs-followup
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-6 text-xs px-2"
                                      onClick={() => {
                                        const newTag: SnippetTag = {
                                          snippetIds: [snippet.id],
                                          tag: "important",
                                          id: `tag-${Date.now()}`
                                        };
                                        setTags([...tags, newTag]);
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />important
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-6 text-xs px-2"
                                      onClick={() => {
                                        const newTag: SnippetTag = {
                                          snippetIds: [snippet.id],
                                          tag: "check-later",
                                          id: `tag-${Date.now()}`
                                        };
                                        setTags([...tags, newTag]);
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />check-later
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>

                      {/* Tags display */}
                      {snippetTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 ml-7">
                          {snippetTags.map(tag => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs bg-gray-100 flex items-center gap-1 px-2 py-0.5"
                            >
                              <span># {tag.tag}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                                onClick={() => deleteTag(tag.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Comments below each snippet */}
                    {snippetComments.length > 0 && (
                      <div className="pl-8 space-y-1 mb-1.5">
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
            <Input
              placeholder="Enter your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[60px]"
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
            <DialogTitle>Add Custom Tag</DialogTitle>
            <DialogDescription>
              Add a custom tag to {selectedSnippets.length} selected snippet{selectedSnippets.length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter tag name (e.g., 'needs-followup', 'important')"
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setTagText('needs-followup')}>
                <Plus className="h-3.5 w-3.5 mr-1" />needs-followup
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTagText('important')}>
                <Plus className="h-3.5 w-3.5 mr-1" />important
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTagText('check-later')}>
                <Plus className="h-3.5 w-3.5 mr-1" />check-later
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagSubmit} disabled={tagText.trim() === ''}>
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Legend Drawer */}
      <Drawer open={isHelpDrawerOpen} onOpenChange={setIsHelpDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Emotion & Tag Legend</DrawerTitle>
            <DrawerDescription>
              Understanding the meanings behind emotion tags and colors
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <h3 className="font-medium mb-2">Emotion Tags</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-200 text-yellow-800">Sarcasm</Badge>
                <span className="text-sm">Unexpected humor or irony in the customer's tone</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-200 text-red-800">Panic</Badge>
                <span className="text-sm">Sudden fear or urgency in the customer's response</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-200 text-blue-800">Anxiety</Badge>
                <span className="text-sm">Uncertainty, worry, or hesitation in the customer's voice</span>
              </div>
            </div>
            
            <h3 className="font-medium mb-2">Using Tags & Comments</h3>
            <p className="text-sm mb-4">
              Tags and comments help identify important parts of the conversation for later review.
              Select multiple snippets to apply the same tag or comment to related content.
            </p>
            
            <h3 className="font-medium mb-2">UI Tips</h3>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Toggle "Select Snippets" to start multi-select mode</li>
              <li>Selected snippets can be tagged or commented on</li>
              <li>Emotions appear as colored badges in the top-right of snippets</li>
              <li>Custom tags appear below the snippet text</li>
              <li>Hover over a snippet to see the tag icon</li>
            </ul>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
