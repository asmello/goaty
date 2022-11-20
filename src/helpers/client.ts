import { v4 as uuiv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export interface ClientConfig {
  authzEndpoint: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}

export function useClient(config: ClientConfig) {
  const state = uuiv4();

  const redirect = () => {
    let params: Record<string, string> = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state: state,
    };
    if (config.scopes !== undefined) {
      params.scope = config.scopes.join(" ");
    }
    const encodedParams = new URLSearchParams(params).toString();
    window.location.href = `${config.authzEndpoint}?${encodedParams}`;
  };

  return redirect;
}
