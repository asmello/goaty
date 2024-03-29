import { json, LoaderFunctionArgs } from "react-router-dom";
import { decode } from "../../common/State";
import { ErrorData } from "../Error";
import { CallbackData, STATE_KEY, TokenRequestConfiguration } from "./Callback";

function emptyTokenRequestConfiguration(): TokenRequestConfiguration {
  return {
    tokenEndpoint: "",
    clientSecret: "",
    useProxy: false,
    proxyUrl: "https://goaty.themelon.net/proxy",
    useBodyCredentials: false,
  };
}

export default async function ({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  const requestUrl = new URL(request.url);
  const state = requestUrl.searchParams.get("state");
  if (!state) {
    throw json<ErrorData>(
      { kind: "MissingParameter", parameter: "state" },
      400
    );
  }

  const error = requestUrl.searchParams.get("error");
  if (error) {
    const description =
      requestUrl.searchParams.get("error_description") ?? undefined;
    const errorUri = requestUrl.searchParams.get("error_uri") ?? undefined;
    throw json<ErrorData>(
      {
        kind: "RemoteError",
        name: error,
        description: description,
        link: errorUri,
      },
      400
    );
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    throw json<ErrorData>({ kind: "MissingParameter", parameter: "code" }, 400);
  }

  const decodedState = decode(state);
  if (!decodedState) {
    throw json<ErrorData>(
      { kind: "InvalidParameter", parameter: "state" },
      400
    );
  }

  const configString =
    window.localStorage.getItem(STATE_KEY) ||
    window.sessionStorage.getItem(STATE_KEY);
  const config: TokenRequestConfiguration = configString
    ? JSON.parse(configString)
    : emptyTokenRequestConfiguration();

  return json<CallbackData>({
    params: {
      code,
      clientId: decodedState.i,
      redirectUri: decodedState.r,
    },
    config,
  });
}
