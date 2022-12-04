import { Form } from "react-router-dom";
import style from "./ConfigurationForm.module.css";
import {
  ConfigurationData,
  convertConfigurationToState,
} from "./Configuration";
import ServerFields from "./ServerFields";
import ClientFields from "./ClientFields";
import ScopesFields from "./ScopesFields";
import OptionsFields from "./OptionsFields";
import ExtrasFields from "./ExtrasFields";
import { encode } from "../../common/State";

interface ConfigurationFormProps {
  configuration: ConfigurationData;
  onConfigurationChanged: (config: ConfigurationData) => void;
}

export default function ConfigurationForm({
  configuration,
  onConfigurationChanged,
}: ConfigurationFormProps) {
  return (
    <Form method="post">
      <div className="grid">
        <ServerFields
          authzEndpoint={configuration.serverConfig.authzEndpoint}
          tokenEndpoint={configuration.serverConfig.tokenEndpoint}
          onAuthzEndpointChange={(newAuthzEndpoint) =>
            onConfigurationChanged({
              ...configuration,
              serverConfig: {
                ...configuration.serverConfig,
                authzEndpoint: newAuthzEndpoint,
              },
            })
          }
          onTokenEndpointChange={(newTokenEndpoint) =>
            onConfigurationChanged({
              ...configuration,
              serverConfig: {
                ...configuration.serverConfig,
                tokenEndpoint: newTokenEndpoint,
              },
            })
          }
        />
        <ClientFields
          clientId={configuration.clientConfig.clientId}
          clientSecret={configuration.clientConfig.clientSecret}
          onClientIdChange={(newClientId) =>
            onConfigurationChanged({
              ...configuration,
              clientConfig: {
                ...configuration.clientConfig,
                clientId: newClientId,
              },
            })
          }
          onClientSecretChange={(newClientSecret) =>
            onConfigurationChanged({
              ...configuration,
              clientConfig: {
                ...configuration.clientConfig,
                clientSecret: newClientSecret,
              },
            })
          }
        />
      </div>
      <div className="grid">
        <ScopesFields
          scopes={configuration.scopes}
          onScopesChange={(newScopes) =>
            onConfigurationChanged({ ...configuration, scopes: newScopes })
          }
        />
        <ExtrasFields
          extras={configuration.extras}
          onExtrasChanged={(newExtras) =>
            onConfigurationChanged({ ...configuration, extras: newExtras })
          }
        />
      </div>
      <div className="grid">
        <OptionsFields
          options={configuration.options}
          onOptionsChanged={(newOptions) =>
            onConfigurationChanged({ ...configuration, options: newOptions })
          }
        />
        <input
          id={style.submitButton}
          type="submit"
          className="primary standalone"
          value="Go"
        />
      </div>
      <input
        name="state"
        type="hidden"
        value={encode(convertConfigurationToState(configuration))}
      />
    </Form>
  );
}
