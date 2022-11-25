import { ChangeEvent, useState } from "react";
import ServerFields from "./ServerFields";

export interface ServerConfig {
  authzEndpoint: string;
  tokenEndpoint: string;
}

export function useServerConfig(
  labelClass: string,
  inputClass: string
): [ServerConfig, JSX.Element] {
  const [authzEndpoint, setAuthzEndpoint] = useState("");
  const handleAuthzUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    setAuthzEndpoint(event.target.value);

  const [tokenEndpoint, setTokenEndpoint] = useState("");
  const handleTokenEndpointChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTokenEndpoint(event.target.value);

  const component = (
    <ServerFields
      labelClass={labelClass}
      inputClass={inputClass}
      authzEndpoint={authzEndpoint}
      tokenEndpoint={tokenEndpoint}
      onAuthzUrlChange={handleAuthzUrlChange}
      onTokenUrlChange={handleTokenEndpointChange}
    />
  );

  return [
    { authzEndpoint: authzEndpoint, tokenEndpoint: tokenEndpoint },
    component,
  ];
}
