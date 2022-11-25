import { useState } from "react";
import ClientFields from "./ClientFields";

export interface ClientConfig {
  clientId: string;
  clientSecret: string;
}

export function useClientConfig(
  labelClass: string,
  inputClass: string
): [ClientConfig, JSX.Element] {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const component = (
    <ClientFields
      labelClass={labelClass}
      inputClass={inputClass}
      clientId={clientId}
      clientSecret={clientSecret}
      onClientIdChange={setClientId}
      onClientSecretChange={setClientSecret}
    />
  );

  return [{ clientId: clientId, clientSecret: clientSecret }, component];
}
