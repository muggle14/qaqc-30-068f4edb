interface ContactInfoProps {
  contactId: string;
  evaluator: string;
}

export const ContactInfo = ({
  contactId,
  evaluator,
}: ContactInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-canvas-muted">Contact ID</h3>
        <p className="text-base font-medium text-canvas-text">{contactId}</p>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-canvas-muted">Evaluator</h3>
        <p className="text-base font-medium text-canvas-text">{evaluator}</p>
      </div>
    </div>
  );
};