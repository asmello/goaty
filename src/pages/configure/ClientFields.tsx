interface ClientFieldsProps {
  clientId: string;
  clientSecret: string;
  onClientIdChange: (clientId: string) => void;
  onClientSecretChange: (clientSecret: string) => void;
}

export default function ClientFields({
  clientId,
  clientSecret,
  onClientIdChange,
  onClientSecretChange,
}: ClientFieldsProps) {
  return (
    <fieldset className="visible centered-text">
      <legend>Client</legend>
      <label>
        Identifier
        <input
          type="text"
          value={clientId}
          onChange={(event) => onClientIdChange(event.target.value)}
        />
      </label>
      <label>
        Secret
        <input
          type="password"
          value={clientSecret}
          onChange={(event) => onClientSecretChange(event.target.value)}
          autoComplete="off"
        />
      </label>
    </fieldset>
  );
}
