
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { ManualContactForm } from "@/components/contact-details/ManualContactForm";

const ManualContactDetails = () => {
  const { loadFromStorage, saveToStorage, clearStorage } = useSessionStorage();
  const initialData = loadFromStorage();

  return (
    <div className="container mx-auto p-6">
      <ManualContactForm
        initialData={initialData}
        onSaveToStorage={saveToStorage}
        onClearStorage={clearStorage}
      />
    </div>
  );
};

export default ManualContactDetails;
