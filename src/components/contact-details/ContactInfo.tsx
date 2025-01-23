interface ContactInfoProps {
  contactId: string;
  evaluator: string;
}

export const ContactInfo = ({
  contactId,
  evaluator,
}: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Contact ID</h3>
        <p>{contactId}</p>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Evaluator</h3>
        <p>{evaluator}</p>
      </div>
    </div>
  );
};