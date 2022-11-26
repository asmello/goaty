interface ClientFieldsProps {
  labelClass: string;
  inputClass: string;
  clientId: string;
  clientSecret: string;
  onClientIdChange: (clientId: string) => void;
  onClientSecretChange: (clientSecret: string) => void;
}

export default function ClientFields({
  labelClass,
  inputClass,
  clientId,
  clientSecret,
  onClientIdChange,
  onClientSecretChange,
}: ClientFieldsProps) {
  return (
    <fieldset>
      <legend>Client</legend>
      <div className="row responsive-label">
        <div className={labelClass}>
          <label htmlFor="client_id">Identifier</label>
        </div>
        <div className={inputClass}>
          <input
            type="text"
            id="client_id"
            value={clientId}
            onChange={(event) => onClientIdChange(event.target.value)}
          />
        </div>
      </div>
      <div className="row responsive-label">
        <div className={labelClass}>
          <label htmlFor="client_secret">Secret</label>
        </div>
        <div className={inputClass}>
          <input
            type="password"
            id="client_secret"
            value={clientSecret}
            onChange={(event) => onClientSecretChange(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
    </fieldset>
  );
}
