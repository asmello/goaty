import { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import InputList, { Item } from "../components/InputList";
import centralStyle from "../common/central.module.css";
import style from "./Start.module.css";
import State from "../common/State";

export default function Start() {
  const redirectUri = window.location.href.replace("start", "callback");

  const [scopes, setScopes] = useState<Item[]>([]);
  const handleScopeDelete = (id: string) => {
    setScopes((items) => items.filter((item) => item.id !== id));
  };
  const handleScopeChange = (id: string, newValue: string) => {
    setScopes((items) =>
      items.map((item) => (item.id === id ? { id: id, value: newValue } : item))
    );
  };
  const handleScopeCreate = () => {
    setScopes((items) => items.concat([{ id: uuid(), value: "" }]));
  };

  const [clientId, setClientId] = useState("");
  const handleClientIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientId(event.target.value);

  const [clientSecret, setClientSecret] = useState("");
  const handleClientSecretChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientSecret(event.target.value);

  const [authzEndpoint, setAuthzEndpoint] = useState("");
  const handleAuthzUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAuthzEndpoint(event.target.value);

  const [tokenEndpoint, setTokenEndpoint] = useState("");
  const handleTokenEndpointChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenEndpoint(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const state: State = {
      t: tokenEndpoint,
      i: clientId,
      s: clientSecret,
    };
    let params: Record<string, string> = {
      response_type: "code",
      client_id: clientId,
      state: btoa(JSON.stringify(state)),
      redirect_uri: redirectUri,
    };
    if (scopes.length > 0) {
      params.scope = scopes.map((scope) => scope.value).join(" ");
    }
    const encodedParams = new URLSearchParams(params).toString();
    window.location.href = `${authzEndpoint}?${encodedParams}`;
  };

  return (
    <div className={centralStyle.central}>
      <div className="row">
        <div className="card fluid">
          <div className="section">
            <h3>Enter the details</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group vertical">
                <label htmlFor="authorization_url">Authorization URL</label>
                <input
                  type="url"
                  id="authorization_url"
                  value={authzEndpoint}
                  onChange={handleAuthzUrlChange}
                />
              </div>
              <div className="input-group vertical">
                <label htmlFor="token_url">Token URL</label>
                <input
                  type="url"
                  id="token_url"
                  value={tokenEndpoint}
                  onChange={handleTokenEndpointChange}
                />
              </div>
              <div className="input-group vertical">
                <label htmlFor="client_id">Client ID</label>
                <input
                  type="text"
                  id="client_id"
                  value={clientId}
                  onChange={handleClientIdChange}
                />
              </div>
              <div className="input-group vertical">
                <label htmlFor="client_secret">Client Secret</label>
                <input
                  type="password"
                  id="client_secret"
                  value={clientSecret}
                  onChange={handleClientSecretChange}
                  autoComplete="off"
                />
              </div>
              <InputList
                label="Scopes"
                items={scopes}
                onCreate={handleScopeCreate}
                onChange={handleScopeChange}
                onDelete={handleScopeDelete}
              />
              <div className={`button-group ${style.expanded}`}>
                <input type="submit" className="primary" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
