import { FormEvent, useEffect, useState } from "react";
import centralStyle from "../../common/central.module.css";
import "./Start.module.css";
import State from "../../common/State";
import { ServerConfig, useServerConfig } from "./server";
import { ClientConfig, useClientConfig } from "./client";
import { Options, useOptions } from "./options";
import { useScopes } from "./scopes";
import { useExtras } from "./extras";
import { useSearchParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";

export default function Start() {
  const redirectUri = window.location.href.replace(/start.*/, "callback");

  const labelClass = "col-sm-12 col-md-3";
  const inputClass = "col-sm-12 col-md";

  const [serverConfig, setServerConfig, serverFields] = useServerConfig(
    labelClass,
    inputClass
  );
  const [clientConfig, setClientConfig, clientFields] = useClientConfig(
    labelClass,
    inputClass
  );
  const [scopes, setScopes, scopesFields] = useScopes();
  const [extras, setExtras, extrasFields] = useExtras();
  const [options, setOptions, optionsFields] = useOptions();

  const [searchParams] = useSearchParams();
  const [state, setState] = useState(searchParams.get("state"));

  useEffect(() => {
    if (state) {
      const decodedState: State = JSON.parse(atob(state));

      const decodedServerConfig: ServerConfig = {
        authzEndpoint: decodedState.z,
        tokenEndpoint: decodedState.t,
      };
      setServerConfig(decodedServerConfig);

      const decodedClientConfig: ClientConfig = {
        clientId: decodedState.i,
        clientSecret: decodedState.s,
      };
      setClientConfig(decodedClientConfig);

      const decodedScopes = decodedState.c
        ?.split(" ")
        .map<Item>((scope) => ({ id: uuid(), value: scope }));
      if (decodedScopes) {
        setScopes(decodedScopes);
      }

      if (decodedState.x) {
        const decodedExtras = Object.entries(decodedState.x).map<MapItem>(
          ([key, value]) => ({ id: uuid(), key: key, value: value })
        );
        setExtras(decodedExtras);
      }

      const decodedOptions: Options = {
        proxyEnabled: decodedState.p !== undefined,
        proxyUrl: decodedState.p,
        sendUri: decodedState.r ?? false,
      };
      setOptions(decodedOptions);
    }
  }, []);

  useEffect(() => {
    let newState: State = {
      z: serverConfig.authzEndpoint,
      t: serverConfig.tokenEndpoint,
      i: clientConfig.clientId,
      s: clientConfig.clientSecret,
    };
    if (options.proxyEnabled) {
      newState.p = options.proxyUrl;
    }
    if (options.sendUri) {
      newState.r = true;
    }
    if (extras.length > 0) {
      newState.x = Object.fromEntries(
        extras.map((extra) => [extra.key, extra.value])
      );
    }
    if (scopes.length > 0) {
      newState.c = scopes.map((scope) => scope.value).join(" ");
    }
    const newStateString = btoa(JSON.stringify(newState));
    setState(newStateString);

    const url = new URL(window.location.toString());
    url.searchParams.set("state", newStateString);
    window.history.replaceState(null, "", url);
  }, [serverConfig, clientConfig, scopes, extras, options]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state) {
      return; // TODO: error
    }
    let params: Record<string, string> = {
      response_type: "code",
      client_id: clientConfig.clientId,
      state: state,
    };
    if (options.sendUri) {
      params.redirect_uri = redirectUri;
    }
    const extrasRecords: Record<string, string> = {};
    extras.forEach((item) => {
      params[item.key] = item.value;
      extrasRecords[item.key] = item.value;
    });
    if (scopes.length > 0) {
      params.scope = scopes.map((scope) => scope.value).join(" ");
    }
    const encodedParams = new URLSearchParams(params).toString();
    window.location.href = `${serverConfig.authzEndpoint}?${encodedParams}`;
  };

  return (
    <div className={`large-container ${centralStyle.central}`}>
      <div className="card fluid">
        <div className="section">
          <h3>Configure</h3>
          <form onSubmit={handleSubmit}>
            <>
              {serverFields}
              {clientFields}
              <div className="row">
                <div className="col-sm">{scopesFields}</div>
                <div className="col-sm">{optionsFields}</div>
              </div>
              <div className="row">{extrasFields}</div>
              <div className="row responsive-label">
                <div className="col-sm" />
                <div className="col-sm-4">
                  <input type="submit" className="primary" value="Start" />
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
