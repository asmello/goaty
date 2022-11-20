import { ChangeEvent, FormEvent, useState } from "react";
import { ClientConfig, useClient } from "../helpers/client";
import "./Home.css";

export default function Home() {
  const [clientId, setClientId] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>();

  const config: ClientConfig = {
    authzEndpoint: "https://github.com/login/oauth/authorize",
    clientId: "c244c6f8b8d49a0ef71b",
    clientSecret: "39ea3bc05aa850a6dfd5ee4e2a8ab45314bb302d",
    redirectUri: "https://localhost:5173/callback",
  };

  const redirect = useClient(config);

  const handleClientIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientId(event.target.value);
  const handleClientSecretChange = (event: ChangeEvent<HTMLInputElement>) =>
    setClientSecret(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    redirect();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card fluid">
          <div className="section">
            <div className="center">
              <h1>
                🐐 GOATY <small>The Generic OAuth2 Token Yanker</small>
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group vertical">
                <label htmlFor="client_id">Client ID</label>
                <input
                  type="text"
                  id="client_id"
                  value={clientId}
                  onChange={handleClientIdChange}
                />
              </div>
              <div className="input-group vertical">
                <label htmlFor="client_secret">Client Secret</label>
                <input
                  type="text"
                  id="client_secret"
                  value={clientSecret}
                  onChange={handleClientSecretChange}
                />
              </div>
              <div className="button-group">
                <input type="submit" className="primary" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
