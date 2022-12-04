import { ChangeEvent } from "react";

interface ServerFieldsProps {
  authzEndpoint: string;
  tokenEndpoint: string;
  onAuthzEndpointChange: (newAuthzEndpoint: string) => void;
  onTokenEndpointChange: (newTokenEndpoint: string) => void;
}

export default function ServerFields(props: ServerFieldsProps) {
  return (
    <fieldset className="visible centered-text">
      <legend>Server</legend>

      <label className="doc">
        Authorization URL
        <input
          name="authzEndpoint"
          type="url"
          value={props.authzEndpoint}
          onChange={(event) => props.onAuthzEndpointChange(event.target.value)}
          placeholder="https://example.com/authorize"
        />
      </label>

      <label>
        Token URL
        <input
          name="tokenEndpoint"
          type="url"
          value={props.tokenEndpoint}
          onChange={(event) => props.onTokenEndpointChange(event.target.value)}
          placeholder="https://example.com/token"
        />
      </label>
    </fieldset>
  );
}
