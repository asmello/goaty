import { ChangeEvent } from "react";

interface ServerFieldsProps {
  authzEndpoint: string;
  tokenEndpoint: string;
  onAuthzUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTokenUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function ServerFields({
  authzEndpoint,
  tokenEndpoint,
  onAuthzUrlChange,
  onTokenUrlChange,
}: ServerFieldsProps) {
  return (
    <fieldset className="visible centered-text">
      <legend>Server</legend>

      <label className="doc">
        Authorization URL
        <input
          type="url"
          value={authzEndpoint}
          onChange={onAuthzUrlChange}
          placeholder="https://example.com/authorize"
        />
      </label>

      <label>
        Token URL
        <input
          type="url"
          value={tokenEndpoint}
          onChange={onTokenUrlChange}
          placeholder="https://example.com/token"
        />
      </label>
    </fieldset>
  );
}
