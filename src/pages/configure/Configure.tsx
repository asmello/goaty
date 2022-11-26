import { FormEvent, useEffect, useState } from "react";
import centralStyle from "../../common/central.module.css";
import style from "./Configure.module.css";
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

export default function Configure() {
  const redirectUri = window.location.href.replace(/configure.*/, "callback");

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

  const [linkCopiedState, setLinkCopiedState] = useState<
    "SUCCESS" | "FAILED" | "IDLE"
  >();

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

      const url = new URL(window.location.href.replace(/\?.*/, ""));
      window.history.replaceState(null, "", url);
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

  const copyShareLink = () => {
    if (state) {
      const url = new URL(window.location.toString());
      url.searchParams.set("state", state);

      navigator.clipboard
        .writeText(url.toString())
        .then(() => setLinkCopiedState("SUCCESS"))
        .catch(() => setLinkCopiedState("FAILED"));
    } else {
      console.warn("Tried to copy link with null state");
    }
  };

  const handleAcceptShareDialogChange = (checked: boolean) => {
    if (checked) {
      if (clientConfig.clientSecret === "") {
        copyShareLink();
      }
    } else {
      setLinkCopiedState("IDLE");
    }
  };

  const acceptShareDialogContents = () => {
    if (linkCopiedState === "SUCCESS") {
      return (
        <>
          <h3 className="section">Success</h3>
          <div className="section centered-text">
            <p>Link successfully copied to clipboard.</p>
          </div>
        </>
      );
    }

    if (linkCopiedState === "FAILED") {
      return (
        <>
          <h3 className="section">Failure</h3>
          <div className="section centered-text">
            <p>Unable to copy link to clipboard.</p>
            <p>Check your permissions.</p>
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="section">Warning</h3>
        <div className="section centered-text">
          <p>
            This URL contains your client secret. Keep it safe and{" "}
            <b>do not share with unauthorized parties</b>.
          </p>
          <button className="warning" onClick={copyShareLink}>
            Confirm
          </button>
        </div>
      </>
    );
  };

  return (
    <div className={`large-container ${centralStyle.central}`}>
      <div className="card fluid shadow">
        <div className="section">
          <div className="row">
            <div className="col-sm">
              <h3>Configuration</h3>
            </div>
            <button
              type="button"
              className={`small ${style.shareButton}`}
              disabled={state === null}
            >
              <label htmlFor="accept-share">
                <span className="icon-share" />
              </label>
            </button>

            <input
              type="checkbox"
              id="accept-share"
              className="modal"
              onChange={(event) =>
                handleAcceptShareDialogChange(event.target.checked)
              }
            />
            <div>
              <div className="card">
                <label htmlFor="accept-share" className="modal-close" />
                {acceptShareDialogContents()}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
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
      </div>
    </div>
  );
}
