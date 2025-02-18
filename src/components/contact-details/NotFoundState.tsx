
import { Card, CardContent } from "@/components/ui/card";
import { ContactHeader } from "./ContactHeader";
import { AlertCircle } from "lucide-react";

export const NotFoundState = () => {
  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-lg font-medium text-gray-900">Contact Not Found</p>
            <p className="text-sm text-gray-500">
              The contact you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
