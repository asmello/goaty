import { useState } from "react";
import { Form } from "react-router-dom";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";
import Extras from "./Extras";
import Scopes from "./Scopes";

export interface AuthzConfigurationData {
  authzEndpoint: string;
  clientId: string;
  scopes: Item[];
  extras: MapItem[];
  sendRedirectUri: boolean;
}

function emptyConfiguration(): AuthzConfigurationData {
  return {
    authzEndpoint: "",
    clientId: "",
    scopes: [],
    extras: [],
    sendRedirectUri: false,
  };
}

export default function AuthzConfiguration() {
  const [config, setConfig] =
    useState<AuthzConfigurationData>(emptyConfiguration);

  return (
    <article>
      <h3>Authorization Request</h3>
      <Form method="post">
        <div className="grid">
          <label>
            Authorization URL
            <input
              required
              name="authzEndpoint"
              type="url"
              value={config.authzEndpoint}
              onChange={(event) =>
                setConfig({
                  ...config,
                  authzEndpoint: event.target.value,
                })
              }
              placeholder="https://example.com/authorize"
            />
          </label>
          <label>
            Client Identifier
            <input
              required
              name="clientId"
              type="text"
              value={config.clientId}
              onChange={(event) =>
                setConfig({
                  ...config,
                  clientId: event.target.value,
                })
              }
            />
          </label>
        </div>
        <div className="grid">
          <Scopes
            items={config.scopes}
            onChanged={(newScopes) =>
              setConfig({ ...config, scopes: newScopes })
            }
          />
          <Extras
            items={config.extras}
            onChanged={(newExtras) =>
              setConfig({ ...config, extras: newExtras })
            }
          />
        </div>
        <div className="grid">
          <fieldset>
            <legend>Options</legend>
            <label>
              <input
                name="sendUri"
                type="checkbox"
                checked={config.sendRedirectUri}
                onChange={(event) =>
                  setConfig({
                    ...config,
                    sendRedirectUri: event.target.checked,
                  })
                }
              />
              Send <code>redirect_uri</code>
            </label>
          </fieldset>
          <input type="submit" className="primary standalone" value="Go" />
        </div>
      </Form>
    </article>
  );
}
