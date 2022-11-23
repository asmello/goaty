import { ChangeEvent, FormEvent, useState } from "react";
import { useHref } from "react-router-dom";
import { v4 as uuiv4 } from "uuid";
import InputList from "../components/InputList";
import centralStyle from "../common/central.module.css";
import style from "./Start.module.css";

export default function Start() {
  const [clientId, setClientId] = useState("c244c6f8b8d49a0ef71b");
  const [clientSecret, setClientSecret] = useState(
    "39ea3bc05aa850a6dfd5ee4e2a8ab45314bb302d"
  );
  const [authzEndpoint, setAuthzEndpoint] = useState(
    "https://github.com/login/oauth/authorize"
  );
  const [scopes, setScopes] = useState<string[]>([]);
  const [state, _] = useState(uuiv4);
  const redirectUri = useHref("callback");

  const handleClientIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientId(event.target.value);
  const handleClientSecretChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientSecret(event.target.value);
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
      params.scope = scopes.join(" ");
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
                  type="text"
                  id="authorization_url"
                  value={authzEndpoint}
                  onChange={handleAuthzUrlChange}
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
                  type="text"
                  id="client_secret"
                  value={clientSecret}
                  onChange={handleClientSecretChange}
                />
              </div>
              <InputList label="Scopes" />
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
