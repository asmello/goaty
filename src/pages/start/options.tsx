import { useState } from "react";
import OptionsFields from "./OptionsFields";

export interface Options {
  proxyEnabled: boolean;
  sendUri: boolean;
}

export function useOptions(): [Options, JSX.Element] {
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [sendUri, setSendUri] = useState(false);

  const component = (
    <OptionsFields
      proxyEnabled={proxyEnabled}
      sendUri={sendUri}
      onProxyEnabledChange={setProxyEnabled}
      onSendUriChange={setSendUri}
    />
  );

  return [{ proxyEnabled: proxyEnabled, sendUri: sendUri }, component];
}
