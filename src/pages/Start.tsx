import { ChangeEvent, FormEvent, useState } from "react";
import { resolvePath } from "react-router-dom";
import { v4 as uuid } from "uuid";
import InputList, { Item } from "../components/InputList";
import centralStyle from "../common/central.module.css";
import style from "./Start.module.css";

export default function Start() {
  const [state, _] = useState(uuid);
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

  const [clientId, setClientId] = useState("c244c6f8b8d49a0ef71b");
  const handleClientIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientId(event.target.value);

  const [clientSecret, setClientSecret] = useState(
    "39ea3bc05aa850a6dfd5ee4e2a8ab45314bb302d"
  );
  const handleClientSecretChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientSecret(event.target.value);

  const [authzEndpoint, setAuthzEndpoint] = useState(
    "https://github.com/login/oauth/authorize"
  );
  const handleAuthzUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAuthzEndpoint(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let params: Record<string, string> = {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
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
                  required
                />
              </div>
              <div className="input-group vertical">
                <label htmlFor="client_id">Client ID</label>
                <input
                  type="text"
                  id="client_id"
                  value={clientId}
                  onChange={handleClientIdChange}
                  required
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
                  required
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
