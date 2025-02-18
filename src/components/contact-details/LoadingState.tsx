
import { Card, CardContent } from "@/components/ui/card";
import { ContactHeader } from "./ContactHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
            ))}
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
