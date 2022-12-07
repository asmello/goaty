import { json } from "react-router-dom";
import { AuthzConfigurationData } from "./AuthzConfiguration";

function emptyConfiguration(): AuthzConfigurationData {
  return {
    authzEndpoint: "",
    clientId: "",
    scopes: [],
    extras: [],
    sendRedirectUri: false,
  };
}

export const STORE_KEY = "authzState";

export default async function (): Promise<Response> {
  const persistentState = window.localStorage.getItem(STORE_KEY);
  if (persistentState) {
    return json<AuthzConfigurationData>(JSON.parse(persistentState));
  }

  const ephemeralState = window.sessionStorage.getItem(STORE_KEY);
  if (ephemeralState) {
    return json<AuthzConfigurationData>(JSON.parse(ephemeralState));
  }

  return json<AuthzConfigurationData>(emptyConfiguration());
}
