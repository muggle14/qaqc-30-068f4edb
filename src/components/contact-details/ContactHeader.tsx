import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ContactHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        className="gap-2 hover:bg-canvas-bg/80 transition-colors"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Button>
      <h1 className="text-2xl font-semibold text-canvas-text">Contact Details</h1>
    </div>
  );
};