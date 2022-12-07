import { useState } from "react";
import { Form, useLoaderData, useOutletContext } from "react-router-dom";
import {
  trySetEphemeralItem,
  trySetPersistentItem,
} from "../../common/helpers";
import { RootState } from "../root/loader";
import style from "./Callback.module.css";
import { CallbackData, STORE_KEY, TokenRequestConfiguration } from "./loader";

export default function Callback() {
  const context = useOutletContext() as RootState;
  const data = useLoaderData() as CallbackData;

  const [config, setConfig] = useState(data.config);
  const handleConfigChange = (
    field: keyof TokenRequestConfiguration,
    newValue: TokenRequestConfiguration[keyof TokenRequestConfiguration]
  ) => {
    const newConfig = {
      ...config,
      [field]: newValue,
    };
    if (context.persistEnabled) {
      trySetPersistentItem(STORE_KEY, newConfig);
    } else {
      trySetEphemeralItem(STORE_KEY, newConfig);
    }
    setConfig(newConfig);
  };

  return (
    <article>
      <h3>Token Request</h3>
      <Form method="post" action="/token">
        <div className="grid">
          <label>
            Token URL
            <input
              required
              name="tokenUrl"
              type="url"
              value={config.tokenEndpoint}
              onChange={(event) =>
                handleConfigChange("tokenEndpoint", event.target.value)
              }
              placeholder="https://example.com/token"
            />
          </label>
          <label>
            Client Secret
            <input
              required
              name="clientSecret"
              type="password"
              value={config.clientSecret}
              onChange={(event) =>
                handleConfigChange("clientSecret", event.target.value)
              }
            />
          </label>
        </div>
        <div className="grid">
          <fieldset>
            <legend>Options</legend>
            <label id={style.useProxyLabel}>
              <input
                name="useProxy"
                type="checkbox"
                checked={config.useProxy}
                onChange={(event) =>
                  handleConfigChange("useProxy", event.target.checked)
                }
              />
              Use proxy
            </label>
            {config.useProxy && (
              <>
                <label htmlFor="proxy_url" hidden>
                  Proxy URL
                </label>
                <input
                  name="proxyUrl"
                  type="url"
                  value={config.proxyUrl}
                  onChange={(event) =>
                    handleConfigChange("proxyUrl", event.target.value)
                  }
                />
              </>
            )}
          </fieldset>
          <input type="submit" className="primary standalone" value="Go" />
        </div>
        <input name="code" type="hidden" value={data.params.code} />
        <input name="clientId" type="hidden" value={data.params.clientId} />
        {data.params.redirectUri && (
          <input
            name="redirectUri"
            type="hidden"
            value={data.params.redirectUri}
          />
        )}
      </Form>
    </article>
  );
}
