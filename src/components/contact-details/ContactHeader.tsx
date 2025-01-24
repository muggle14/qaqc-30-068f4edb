import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ContactHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="mb-4 gap-2"
      onClick={() => navigate("/admin")}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Admin
    </Button>
  );
};