interface OptionsFieldsProps {
  proxyEnabled: boolean;
  proxyUrl: string;
  sendUri: boolean;
  onProxyEnabledChange: (newValue: boolean) => void;
  onProxyUrlChange: (newValue: string) => void;
  onSendUriChange: (newValue: boolean) => void;
}

export default function OptionsFields({
  proxyEnabled,
  proxyUrl,
  sendUri,
  onProxyEnabledChange,
  onProxyUrlChange,
  onSendUriChange,
}: OptionsFieldsProps) {
  return (
    <div className="row">
      <fieldset>
        <legend>Options</legend>
        <div className="row">
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
          {proxyEnabled && (
            <div className="col-sm-9">
              <label htmlFor="proxy_url" hidden>
                Proxy URL
              </label>
              <input
                id="proxy_url"
                type="url"
                value={proxyUrl}
                onChange={(event) => onProxyUrlChange(event.target.value)}
              />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}
