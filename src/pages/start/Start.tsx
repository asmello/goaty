import { FormEvent } from "react";
import centralStyle from "../../common/central.module.css";
import style from "./Start.module.css";
import State from "../../common/State";
import { useServerConfig } from "./server";
import { useClientConfig } from "./client";
import { useOptions } from "./options";
import { useScopes } from "./scopes";
import { useExtras } from "./extras";

export default function Start() {
  const redirectUri = window.location.href.replace("start", "callback");

  const labelClass = "col-sm-12 col-md-3";
  const inputClass = "col-sm-12 col-md";

  const [serverConfig, serverFields] = useServerConfig(labelClass, inputClass);
  const [clientConfig, clientFields] = useClientConfig(labelClass, inputClass);
  const [scopes, scopesFields] = useScopes();
  const [extras, extrasFields] = useExtras();
  const [options, optionsFields] = useOptions();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const state: State = {
      t: serverConfig.tokenEndpoint,
      i: clientConfig.clientId,
      s: clientConfig.clientSecret,
    };
    let params: Record<string, string> = {
      response_type: "code",
      client_id: clientConfig.clientId,
      state: btoa(JSON.stringify(state)),
    };
    if (options.sendUri) {
      params.redirect_uri = redirectUri;
    }
    extras.forEach((item) => (params[item.key] = item.value));
    if (scopes.length > 0) {
      params.scope = scopes.map((scope) => scope.value).join(" ");
    }
    const encodedParams = new URLSearchParams(params).toString();
    window.location.href = `${serverConfig.authzEndpoint}?${encodedParams}`;
  };

  return (
    <div className={`${centralStyle.central} ${style.large}`}>
      <div className="card fluid">
        <div className="section">
          <h3>Configure</h3>
          <form onSubmit={handleSubmit}>
            <>
              {serverFields}
              {clientFields}
              {scopesFields}
              {extrasFields}
              {optionsFields}
              <div className="row responsive-label">
                <div className="col-sm" />
                <div className="col-sm-4">
                  <input type="submit" className="primary" value="Submit" />
                </div>
                <div className="col-sm" />
              </div>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
