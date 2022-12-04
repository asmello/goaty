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
  if (request.method === "POST") {
    const data = await request.formData();
    const stateString = data.get("state")?.toString();
    if (!stateString) {
      return createEmptyConfig();
    }
    const decodedState = decode(stateString);
    if (!decodedState) {
      return createEmptyConfig();
    }
    return convertStateToConfiguration(decodedState);
  } else {
    return createEmptyConfig();
  }
}
