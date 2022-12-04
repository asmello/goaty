import { LoaderFunctionArgs } from "react-router-dom";
import { decode } from "../../common/State";
import {
  ConfigurationData,
  convertStateToConfiguration,
} from "./Configuration";

function createEmptyConfig(): ConfigurationData {
  return {
    serverConfig: {
      authzEndpoint: "",
      tokenEndpoint: "",
    },
    clientConfig: {
      clientId: "",
      clientSecret: "",
    },
    scopes: [],
    extras: [],
    options: {
      proxyEnabled: false,
      sendUri: false,
    },
  };
}

export async function configurationLoader({
  request,
}: LoaderFunctionArgs): Promise<ConfigurationData> {
  const data = await request.formData();
  const state = data.get("state");
  if (!state) {
    return createEmptyConfig();
  }
  const decoded = decode(state.toString());
  if (!decoded) {
    return createEmptyConfig();
  }
  return convertStateToConfiguration(decoded);
}
