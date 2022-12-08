import { json } from "react-router-dom";
import { AuthzConfigurationData, STATE_KEY } from "./AuthzConfiguration";

function emptyConfiguration(): AuthzConfigurationData {
  return {
    authzEndpoint: "",
    clientId: "",
    scopes: [],
    extras: [],
    sendRedirectUri: false,
  };
}

export default async function (): Promise<Response> {
  const persistentState = window.localStorage.getItem(STATE_KEY);
  if (persistentState) {
    return json<AuthzConfigurationData>(JSON.parse(persistentState));
  }

  const ephemeralState = window.sessionStorage.getItem(STATE_KEY);
  if (ephemeralState) {
    return json<AuthzConfigurationData>(JSON.parse(ephemeralState));
  }

  return json<AuthzConfigurationData>(emptyConfiguration());
}
