import { ChangeEvent, FormEvent, useState } from "react";
import centralStyle from "../common/central.module.css";
import style from "./Start.module.css";
import State from "../common/State";
import { useInputList, useInputMap } from "../common/hooks";

export default function Start() {
  const redirectUri = window.location.href.replace("start", "callback");

  const [scopes, scopesComponent] = useInputList();
  const [extras, extrasComponent] = useInputMap();

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
    extras.forEach((item) => (params[item.key] = item.value));
    if (scopes.length > 0) {
      params.scope = scopes.map((scope) => scope.value).join(" ");
    }
    const encodedParams = new URLSearchParams(params).toString();
    window.location.href = `${authzEndpoint}?${encodedParams}`;
  };

  const labelClass = "col-sm-12 col-md-3";
  const inputClass = "col-sm-12 col-md";

  return (
    <div className={`${centralStyle.central} ${style.large}`}>
      <div className="card fluid">
        <div className="section">
          <h3>Enter the details</h3>
          <form onSubmit={handleSubmit}>
            <div className="row responsive-label">
              <div className={labelClass}>
                <label htmlFor="authorization_url" className="doc">
                  Authorization URL
                </label>
              </div>
              <div className={inputClass}>
                <input
                  type="url"
                  id="authorization_url"
                  value={authzEndpoint}
                  onChange={handleAuthzUrlChange}
                  placeholder="https://example.com/authorize"
                />
              </div>
            </div>
            <div className="row responsive-label">
              <div className={labelClass}>
                <label htmlFor="token_url">Token URL</label>
              </div>
              <div className={inputClass}>
                <input
                  type="url"
                  id="token_url"
                  value={tokenEndpoint}
                  onChange={handleTokenEndpointChange}
                  placeholder="https://example.com/token"
                />
              </div>
            </div>
            <div className="row responsive-label">
              <div className={labelClass}>
                <label htmlFor="client_id">Client ID</label>
              </div>
              <div className={inputClass}>
                <input
                  type="text"
                  id="client_id"
                  value={clientId}
                  onChange={handleClientIdChange}
                />
              </div>
            </div>
            <div className="row responsive-label">
              <div className={labelClass}>
                <label htmlFor="client_secret">Client Secret</label>
              </div>
              <div className={inputClass}>
                <input
                  type="password"
                  id="client_secret"
                  value={clientSecret}
                  onChange={handleClientSecretChange}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="row">
              <fieldset>
                <>
                  <legend>Scopes</legend>
                  {scopesComponent}
                </>
              </fieldset>
            </div>
            <div className="row">
              <fieldset>
                <>
                  <legend>Extra Parameters</legend>
                  {extrasComponent}
                </>
              </fieldset>
            </div>
            <div className="row">
              <fieldset>
                <legend>Options</legend>
                <div className="row">
                  <div className={`col-sm ${style.centred}`}>
                    <label htmlFor="use_proxy">Use proxy</label>
                    <input type="checkbox" id="use_proxy" />
                  </div>
                  <div className={`col-sm ${style.centred}`}>
                    <label htmlFor="send_uri">
                      Send <code>redirect_uri</code>
                    </label>
                    <input type="checkbox" id="send_uri" />
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="row responsive-label">
              <div className="col-sm-4" />
              <div className="col-sm-4">
                <input type="submit" className="primary" value="Submit" />
              </div>
              <div className="col-sm-4" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
