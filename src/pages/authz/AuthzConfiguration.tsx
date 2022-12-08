import { Form, useLoaderData, useOutletContext } from "react-router-dom";
import { useStateUpdater } from "../../common/helpers";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";
import { RootState } from "../root/Root";
import Extras from "./Extras";
import Scopes from "./Scopes";

export const STATE_KEY = "authzState";

export interface AuthzConfigurationData {
  authzEndpoint: string;
  clientId: string;
  scopes: Item[];
  extras: MapItem[];
  sendRedirectUri: boolean;
}

export default function AuthzConfiguration() {
  const context = useOutletContext() as RootState;
  const initialConfig = useLoaderData() as AuthzConfigurationData;

  const [config, handleConfigChange] = useStateUpdater(
    context,
    STATE_KEY,
    initialConfig
  );

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
                handleConfigChange("authzEndpoint", event.target.value)
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
                handleConfigChange("clientId", event.target.value)
              }
            />
          </label>
        </div>
        <div className="grid">
          <Scopes
            items={config.scopes}
            onChanged={(newScopes) => handleConfigChange("scopes", newScopes)}
          />
          <Extras
            items={config.extras}
            onChanged={(newExtras) => handleConfigChange("extras", newExtras)}
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
                  handleConfigChange("sendRedirectUri", event.target.checked)
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
