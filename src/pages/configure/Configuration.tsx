import { useEffect, useState } from "react";
import State from "../../common/State";
import { ServerConfig, useServerConfig } from "./server";
import { ClientConfig, useClientConfig } from "./client";
import { Options, useOptions } from "./options";
import { useScopes } from "./scopes";
import { useExtras } from "./extras";
import {
  ActionFunctionArgs,
  Form,
  json,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Configuration.module.css";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { ErrorData } from "../Error";
import ShareModal, { ShareModalState } from "./ShareModal";

interface ConfigurationData {
  serverConfig: ServerConfig;
  clientConfig: ClientConfig;
  scopes: Item[];
  extras: MapItem[];
  options: Options;
}

export async function loader({
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

  return {
    serverConfig: decodedServerConfig,
    clientConfig: decodedClientConfig,
    scopes: decodedScopes,
    extras: decodedExtras,
    options: decodedOptions,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const authzEndpoint = data.get("authzEndpoint")?.toString();
  const clientId = data.get("clientId")?.toString();
  const state = data.get("state")?.toString();
  if (!state || !clientId || !authzEndpoint) {
    throw json<ErrorData>(
      {
        header: "Incomplete",
        body: "Configuration payload is missing one or more required fields.",
      },
      400
    );
  }

  const targetUrl = new URL(authzEndpoint);
  targetUrl.searchParams.set("response_type", "code");
  targetUrl.searchParams.set("client_id", clientId);
  targetUrl.searchParams.set("state", state);

  const sendUri = data.get("sendUri")?.toString();
  if (sendUri) {
    targetUrl.searchParams.set(
      "redirect_uri",
      window.location.href.replace(/configure.*/, "callback")
    );
  }

  const extrasString = data.get("extras")?.toString();
  if (extrasString) {
    const extras: [string, string][] = JSON.parse(extrasString);
    extras.forEach(([key, value]) => {
      targetUrl.searchParams.set(key, value);
    });
  }

  const scopes = data.get("scopes")?.toString();
  if (scopes) {
    targetUrl.searchParams.set("scope", scopes);
  }

  window.location.href = targetUrl.toString();
}

export default function Configuration() {
  const [serverConfig, setServerConfig, serverFieldset] = useServerConfig();
  const [clientConfig, setClientConfig, clientFieldset] = useClientConfig();
  const [scopes, setScopes, scopesFieldset] = useScopes();
  const [extras, setExtras, extrasFieldset] = useExtras();
  const [options, setOptions, optionsFieldset] = useOptions();
  const [state, setState] = useState<string>();
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

    const url = new URL(window.location.href.replace(/\?.*/, ""));
    window.history.replaceState(null, "", url);
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

  const copyShareLink = async () => {
    if (state) {
      const url = new URL(window.location.toString());
      url.searchParams.set("state", state);

      return navigator.clipboard
        .writeText(url.toString())
        .then(() => setShareModalState("SUCCESS"))
        .catch(() => setShareModalState("FAILED"));
    } else {
      console.warn("Tried to copy link with undefined state");
    }
  };

  const handleShareClick = async () => {
    if (clientConfig.clientSecret) {
      setShareModalState("OPEN");
    } else {
      await copyShareLink();
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

      <ShareModal
        shareModalState={shareModalState}
        shareModalStateChanged={setShareModalState}
        copyShareLink={copyShareLink}
      />

      <h3>Configuration</h3>
      <Form method="post">
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
        <input name="state" type="hidden" value={state || ""} />
      </Form>
    </article>
  );
}
