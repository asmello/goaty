import { useState } from "react";
import { Item } from "../../components/InputListItem";
import { MapItem } from "../../components/InputMapItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Configuration.module.css";
import ShareModal, { ShareModalState } from "./ShareModal";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import ConfigurationForm from "./ConfigurationForm";
import { useLoaderData } from "react-router-dom";
import State from "../../common/State";
import { v4 as uuid } from "uuid";
import { Options } from "./OptionsFields";

interface ServerConfig {
  authzEndpoint: string;
  tokenEndpoint: string;
}

interface ClientConfig {
  clientId: string;
  clientSecret: string;
}

export interface ConfigurationData {
  serverConfig: ServerConfig;
  clientConfig: ClientConfig;
  scopes: Item[];
  extras: MapItem[];
  options: Options;
}

export default function Configuration() {
  const [config, setConfig] = useState<ConfigurationData>(
    useLoaderData() as ConfigurationData
  );
  const [shareModalState, setShareModalState] =
    useState<ShareModalState>("CLOSED");

  return (
    <article>
      <button
        role="button"
        className={`small inline secondary ${style.headerButton}`}
        onClick={() => setShareModalState("OPEN")}
      >
        <FontAwesomeIcon icon={faShareFromSquare} />
      </button>

      <ShareModal
        configuration={config}
        onConfigurationChanged={setConfig}
        modalState={shareModalState}
        onModalStateChanged={setShareModalState}
      />

      <h3>Configuration</h3>
      <ConfigurationForm
        configuration={config}
        onConfigurationChanged={setConfig}
      />
    </article>
  );
}

export function convertConfigurationToState(config: ConfigurationData): State {
  let newState: State = {
    z: config.serverConfig.authzEndpoint,
    t: config.serverConfig.tokenEndpoint,
    i: config.clientConfig.clientId,
    s: config.clientConfig.clientSecret,
  };
  if (config.options.proxyEnabled) {
    newState.p = config.options.proxyUrl;
  }
  if (config.options.sendUri) {
    newState.r = true;
  }
  if (config.extras.length > 0) {
    newState.x = Object.fromEntries(
      config.extras.map((extra) => [extra.key, extra.value])
    );
  }
  if (config.scopes.length > 0) {
    newState.c = config.scopes.map((scope) => scope.value).join(" ");
  }
  return newState;
}

export function convertStateToConfiguration(state: State): ConfigurationData {
  const decodedServerConfig: ServerConfig = {
    authzEndpoint: state.z,
    tokenEndpoint: state.t,
  };

  const decodedClientConfig: ClientConfig = {
    clientId: state.i,
    clientSecret: state.s,
  };

  const decodedScopes =
    state.c?.split(" ").map<Item>((scope) => ({ id: uuid(), value: scope })) ??
    [];

  const decodedExtras = state.x
    ? Object.entries(state.x).map<MapItem>(([key, value]) => ({
        id: uuid(),
        key: key,
        value: value,
      }))
    : [];

  const decodedOptions: Options = {
    proxyEnabled: state.p !== undefined,
    proxyUrl: state.p,
    sendUri: state.r ?? false,
  };

  return {
    serverConfig: decodedServerConfig,
    clientConfig: decodedClientConfig,
    scopes: decodedScopes,
    extras: decodedExtras,
    options: decodedOptions,
  };
}
