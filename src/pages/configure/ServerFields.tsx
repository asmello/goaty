import { ChangeEvent } from "react";

interface ServerFieldsProps {
  labelClass: string;
  inputClass: string;
  authzEndpoint: string;
  tokenEndpoint: string;
  onAuthzUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTokenUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function ServerFields({
  labelClass,
  inputClass,
  authzEndpoint,
  tokenEndpoint,
  onAuthzUrlChange,
  onTokenUrlChange,
}: ServerFieldsProps) {
  return (
    <fieldset>
      <legend>Server</legend>
      <div className="row responsive-label">
        <div className={labelClass}>
          <label htmlFor="authorization_url" className="doc">
            Authorization URL
          </label>
        </div>
        <div className={inputClass}>
          <input
            type="url"
            id="authorization_url"
            value={authzEndpoint}
            onChange={onAuthzUrlChange}
            placeholder="https://example.com/authorize"
          />
        </div>
      </div>
      <div className="row responsive-label">
        <div className={labelClass}>
          <label htmlFor="token_url">Token URL</label>
        </div>
        <div className={inputClass}>
          <input
            type="url"
            id="token_url"
            value={tokenEndpoint}
            onChange={onTokenUrlChange}
            placeholder="https://example.com/token"
          />
        </div>
      </div>
    </fieldset>
  );
}
