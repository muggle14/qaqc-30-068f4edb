import { format } from "date-fns";

interface ContactInfoProps {
  contactId: string;
  evaluator: string;
  uploadTimestamp: string;
  updatedAt?: string | null;
}

export const ContactInfo = ({
  contactId,
  evaluator,
  uploadTimestamp,
  updatedAt,
}: ContactInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Contact ID</h3>
        <p>{contactId}</p>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Evaluator</h3>
        <p>{evaluator}</p>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Upload Date</h3>
        <p>
          {uploadTimestamp
            ? format(new Date(uploadTimestamp), "PPpp")
            : "N/A"}
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Last Updated</h3>
        <p>
          {updatedAt
            ? format(new Date(updatedAt), "PPpp")
            : "N/A"}
        </p>
      </div>
    </div>
  );
};