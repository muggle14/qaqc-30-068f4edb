import { FileUpload } from "@/components/FileUpload";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-tool-primary mb-8 text-center">Admin Access</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">Upload Contact Details</h2>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;