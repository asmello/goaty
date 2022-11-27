import style from "./OptionsFields.module.css";

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
    <fieldset className="tight">
      <legend>Options</legend>

      <label>
        <input
          type="checkbox"
          role="switch"
          checked={sendUri}
          onChange={(event) => onSendUriChange(event.target.checked)}
        />
        Send <code>redirect_uri</code>
      </label>

      <label className={style.final}>
        <input
          type="checkbox"
          role="switch"
          checked={proxyEnabled}
          onChange={(event) => onProxyEnabledChange(event.target.checked)}
        />
        Use proxy
      </label>
      {proxyEnabled && (
        <>
          <label htmlFor="proxy_url" hidden>
            Proxy URL
          </label>
          <input
            id="proxy_url"
            type="url"
            value={proxyUrl}
            onChange={(event) => onProxyUrlChange(event.target.value)}
          />
        </>
      )}
    </fieldset>
  );
}
