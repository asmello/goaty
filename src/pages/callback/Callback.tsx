import { Form, useLoaderData } from "react-router-dom";
import { CallbackParams } from "./loader";
import style from "./Callback.module.css";
import { useState } from "react";

interface TokenRequestConfiguration {
  tokenEndpoint: string;
  clientSecret: string;
  useProxy: boolean;
  proxyUrl?: string;
}

function emptyTokenRequestConfiguration(): TokenRequestConfiguration {
  return {
    tokenEndpoint: "",
    clientSecret: "",
    useProxy: false,
    proxyUrl: "https://goaty.themelon.net/proxy",
  };
}

export default function Callback() {
  const data = useLoaderData() as CallbackParams;
  const [config, setConfig] = useState(emptyTokenRequestConfiguration);

  return (
    <article>
      <h3>Token Request</h3>
      <Form method="post" action="/token">
        <div className="grid">
          <label>
            Token URL
            <input
              name="tokenUrl"
              type="url"
              value={config.tokenEndpoint}
              onChange={(event) =>
                setConfig({
                  ...config,
                  tokenEndpoint: event.target.value,
                })
              }
              placeholder="https://example.com/token"
            />
          </label>
          <label>
            Client Secret
            <input
              name="clientSecret"
              type="password"
              value={config.clientSecret}
              onChange={(event) =>
                setConfig({
                  ...config,
                  clientSecret: event.target.value,
                })
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
                  setConfig({
                    ...config,
                    useProxy: event.target.checked,
                  })
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
                    setConfig({
                      ...config,
                      proxyUrl: event.target.value,
                    })
                  }
                />
              </>
            )}
          </fieldset>
          <input type="submit" className="primary standalone" value="Go" />
        </div>
        <input name="code" type="hidden" value={data.code} />
        <input name="clientId" type="hidden" value={data.clientId} />
        {data.redirectUri && (
          <input name="redirectUri" type="hidden" value={data.redirectUri} />
        )}
      </Form>
    </article>
  );
}
