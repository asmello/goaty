import { useState } from "react";
import ClientFields from "./ClientFields";

export interface ClientConfig {
  clientId: string;
  clientSecret: string;
}

export function useClientConfig(): [
  ClientConfig,
  (newConfig: ClientConfig) => void,
  JSX.Element
] {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const setConfig = (newConfig: ClientConfig) => {
    setClientId(newConfig.clientId);
    setClientSecret(newConfig.clientSecret);
  };

  const component = (
    <ClientFields
      clientId={clientId}
      clientSecret={clientSecret}
      onClientIdChange={setClientId}
      onClientSecretChange={setClientSecret}
    />
  );

  return [
    { clientId: clientId, clientSecret: clientSecret },
    setConfig,
    component,
  ];
}
