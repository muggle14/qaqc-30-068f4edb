import { FileUpload } from "@/components/FileUpload";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Upload Contact Details</h1>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;