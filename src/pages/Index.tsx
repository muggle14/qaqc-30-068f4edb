import { FileUpload } from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Contact Details</h1>
      <FileUpload />
    </div>
  );
};

export default Index;