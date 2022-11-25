interface OptionsFieldsProps {
  proxyEnabled: boolean;
  sendUri: boolean;
  onProxyEnabledChange: (newValue: boolean) => void;
  onSendUriChange: (newValue: boolean) => void;
}

export default function OptionsFields({
  proxyEnabled,
  sendUri,
  onProxyEnabledChange,
  onSendUriChange,
}: OptionsFieldsProps) {
  return (
    <div className="row">
      <fieldset>
        <legend>Options</legend>
        <div className="row">
          <div className="col-sm centred">
            <label htmlFor="proxy_enabled">Use proxy</label>
            <input
              type="checkbox"
              id="proxy_enabled"
              checked={proxyEnabled}
              onChange={(event) => onProxyEnabledChange(event.target.checked)}
            />
          </div>
          <div className="col-sm centred">
            <label htmlFor="send_uri">
              Send <code>redirect_uri</code>
            </label>
            <input
              type="checkbox"
              id="send_uri"
              checked={sendUri}
              onChange={(event) => onSendUriChange(event.target.checked)}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
