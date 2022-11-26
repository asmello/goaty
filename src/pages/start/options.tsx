import { useState } from "react";
import OptionsFields from "./OptionsFields";

export interface Options {
  proxyEnabled: boolean;
  proxyUrl?: string;
  sendUri: boolean;
}

export function useOptions(): [
  Options,
  (newOptions: Options) => void,
  JSX.Element
] {
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyUrl, setProxyUrl] = useState("https://goaty.themelon.net/proxy");
  const [sendUri, setSendUri] = useState(false);

  const setOptions = (newOptions: Options) => {
    setProxyEnabled(newOptions.proxyEnabled);
    if (newOptions.proxyUrl) {
      setProxyUrl(newOptions.proxyUrl);
    }
    setSendUri(newOptions.sendUri);
  };

  const component = (
    <OptionsFields
      proxyEnabled={proxyEnabled}
      proxyUrl={proxyUrl}
      sendUri={sendUri}
      onProxyEnabledChange={setProxyEnabled}
      onProxyUrlChange={setProxyUrl}
      onSendUriChange={setSendUri}
    />
  );

  return [
    { proxyEnabled: proxyEnabled, proxyUrl: proxyUrl, sendUri: sendUri },
    setOptions,
    component,
  ];
}
