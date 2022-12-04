import style from "./OptionsFields.module.css";

export interface Options {
  proxyEnabled: boolean;
  proxyUrl?: string;
  sendUri: boolean;
}

interface OptionsFieldsProps {
  options: Options;
  onOptionsChanged: (newOptions: Options) => void;
}

const DEFAULT_PROXY_URL = "https://goaty.themelon.net/proxy";

export default function OptionsFields({
  options,
  onOptionsChanged,
}: OptionsFieldsProps) {
  return (
    <fieldset className="tight">
      <legend>Options</legend>

      <label>
        <input
          name="sendUri"
          type="checkbox"
          checked={options.sendUri}
          onChange={(event) =>
            onOptionsChanged({ ...options, sendUri: event.target.checked })
          }
        />
        Send <code>redirect_uri</code>
      </label>

      <label className={style.final}>
        <input
          type="checkbox"
          checked={options.proxyEnabled}
          onChange={(event) =>
            onOptionsChanged({
              ...options,
              proxyEnabled: event.target.checked,
              proxyUrl: options.proxyUrl ?? DEFAULT_PROXY_URL,
            })
          }
        />
        Use proxy
      </label>
      {options.proxyEnabled && (
        <>
          <label htmlFor="proxy_url" hidden>
            Proxy URL
          </label>
          <input
            id="proxy_url"
            type="url"
            value={options.proxyUrl}
            onChange={(event) =>
              onOptionsChanged({ ...options, proxyUrl: event.target.value })
            }
          />
        </>
      )}
    </fieldset>
  );
}
