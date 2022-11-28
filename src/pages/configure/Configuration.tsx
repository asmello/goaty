import { FormEvent, useEffect, useState } from "react";
import State from "../../common/State";
import { ServerConfig, useServerConfig } from "./server";
import { ClientConfig, useClientConfig } from "./client";
import { Options, useOptions } from "./options";
import { useScopes } from "./scopes";
import { useExtras } from "./extras";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Configuration.module.css";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

interface ConfigurationData {
  serverConfig: ServerConfig;
  clientConfig: ClientConfig;
  scopes: Item[];
  extras: MapItem[];
  options: Options;
}

type ShareModalState = "CLOSED" | "OPEN" | "SUCCESS" | "FAILED";

export async function loadState({
  request,
}: LoaderFunctionArgs): Promise<ConfigurationData | undefined> {
  const requestUrl = new URL(request.url);
  const state = requestUrl.searchParams.get("state");
  if (!state) return undefined;

  const decodedState: State = JSON.parse(atob(state));

  const decodedServerConfig: ServerConfig = {
    authzEndpoint: decodedState.z,
    tokenEndpoint: decodedState.t,
  };

  const decodedClientConfig: ClientConfig = {
    clientId: decodedState.i,
    clientSecret: decodedState.s,
  };

  const decodedScopes =
    decodedState.c
      ?.split(" ")
      .map<Item>((scope) => ({ id: uuid(), value: scope })) ?? [];

  const decodedExtras = decodedState.x
    ? Object.entries(decodedState.x).map<MapItem>(([key, value]) => ({
        id: uuid(),
        key: key,
        value: value,
      }))
    : [];

  const decodedOptions: Options = {
    proxyEnabled: decodedState.p !== undefined,
    proxyUrl: decodedState.p,
    sendUri: decodedState.r ?? false,
  };

  const url = new URL(window.location.href.replace(/\?.*/, ""));
  window.history.replaceState(null, "", url);

  return {
    serverConfig: decodedServerConfig,
    clientConfig: decodedClientConfig,
    scopes: decodedScopes,
    extras: decodedExtras,
    options: decodedOptions,
  };
}

export default function Configuration() {
  const [serverConfig, setServerConfig, serverFieldset] = useServerConfig();
  const [clientConfig, setClientConfig, clientFieldset] = useClientConfig();
  const [scopes, setScopes, scopesFieldset] = useScopes();
  const [extras, setExtras, extrasFieldset] = useExtras();
  const [options, setOptions, optionsFieldset] = useOptions();

  const [searchParams] = useSearchParams();
  const [state, setState] = useState(searchParams.get("state"));

  const [shareModalState, setShareModalState] =
    useState<ShareModalState>("CLOSED");

  const config = useLoaderData() as ConfigurationData | undefined;

  useEffect(() => {
    if (config) {
      setServerConfig(config.serverConfig);
      setClientConfig(config.clientConfig);
      setScopes(config.scopes);
      setExtras(config.extras);
      setOptions(config.options);
    }
  }, [config]);

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
      params.redirect_uri = window.location.href.replace(
        /configure.*/,
        "callback"
      );
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
        .then(() => setShareModalState("SUCCESS"))
        .catch(() => setShareModalState("FAILED"));
    } else {
      console.warn("Tried to copy link with null state");
    }
  };

  const shareModalContents = () => {
    if (shareModalState === "SUCCESS") {
      return (
        <article>
          <header>
            <a
              aria-label="Close"
              className="close"
              onClick={() => setShareModalState("CLOSED")}
            />
            Success
          </header>
          <p>The share URL has been copied to the clipboard.</p>
        </article>
      );
    }

    if (shareModalState === "FAILED") {
      return (
        <article>
          <header>
            <a
              aria-label="Close"
              className="close"
              onClick={() => setShareModalState("CLOSED")}
            />
            Failure
          </header>
          <p>The share URL could not be copied to the clipboard.</p>
          <p>This could be due to a permissions issue.</p>
        </article>
      );
    }

    return (
      <article>
        <header>
          <a
            aria-label="Close"
            className="close"
            onClick={() => setShareModalState("CLOSED")}
          />
          Warning
        </header>
        <p>This URL contains your client secret.</p>
        <p>
          Keep it safe and <b>do not share with unauthorized parties</b>.
        </p>
        <footer>
          <button
            role="button"
            className="inline secondary"
            onClick={() => setShareModalState("CLOSED")}
          >
            Cancel
          </button>
          <button className="inline" role="button" onClick={copyShareLink}>
            Proceed
          </button>
        </footer>
      </article>
    );
  };

  const handleShareClick = () => {
    if (clientConfig.clientSecret) {
      setShareModalState("OPEN");
    } else {
      copyShareLink();
    }
  };

  return (
    <article>
      <button
        id={style.shareButton}
        role="button"
        className="small inline secondary"
        onClick={handleShareClick}
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>

      <dialog open={shareModalState !== "CLOSED"}>
        {shareModalContents()}
      </dialog>

      <h3>Configuration</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid">
          {serverFieldset}
          {clientFieldset}
        </div>
        <div className="grid">
          {scopesFieldset}
          {extrasFieldset}
        </div>
        <div className="grid">
          {optionsFieldset}
          <input
            id={style.submitButton}
            type="submit"
            className="primary standalone"
            value="Go"
          />
        </div>
      </form>
    </article>
  );
}
