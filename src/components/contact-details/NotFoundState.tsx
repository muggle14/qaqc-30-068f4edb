import { Card, CardContent } from "@/components/ui/card";
import { ContactHeader } from "./ContactHeader";

export const NotFoundState = () => {
  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Contact not found</p>
        </CardContent>
      </Card>
    </div>
  );
};