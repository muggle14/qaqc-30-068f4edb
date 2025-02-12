
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ManualContactDetails = () => {
  const [transcript, setTranscript] = useState("");
  const [contactId, setContactId] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transcript || !contactId || !evaluator) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Navigate to contact details view with the form data
    navigate("/contact/view", {
      state: {
        contactData: {
          contact_id: contactId,
          evaluator: evaluator,
          transcript: transcript
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Contact Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contactId">Contact ID</Label>
              <Input
                id="contactId"
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                placeholder="Enter contact ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluator">Evaluator</Label>
              <Input
                id="evaluator"
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                placeholder="Enter evaluator name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript">Transcript</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter conversation transcript"
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit">
                View Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualContactDetails;
