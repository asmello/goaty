import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import State from "../common/State";
import centralStyle from "../common/central.module.css";
import "./Callback.module.css";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export default function Callback() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const [tokenResponse, setTokenResponse] = useState<TokenResponse>();
  const [axiosError, setAxiosError] = useState<AxiosError>();
  const state = searchParams.get("state");
  if (state === null) {
    return (
      <>
        <input
          type="checkbox"
          id="modal-control"
          className="modal"
          defaultChecked
          onChange={(event) => {
            if (!event.target.checked) navigateToConfigure();
          }}
        />
        <div>
          <div className="card">
            <label htmlFor="modal-control" className="modal-close"></label>
            <h3 className="section">Error</h3>

            <div className="section">
              <p>
                The remote server did not return the <code>state</code>
                parameter.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const configureFragment = `/configure?state=${state}`;

  const navigateToConfigure = () => {
    navigate(configureFragment);
  };

  if (searchParams.get("error")) {
    const error = searchParams.get("error");
    const description = searchParams.get("error_description");
    const errorUri = searchParams.get("error_uri");
    const errorElement =
      errorUri === null ? (
        <code>{error}</code>
      ) : (
        <a href={errorUri}>
          <code>{error}</code>
        </a>
      );
    return (
      <>
        <input
          type="checkbox"
          id="modal-control"
          className="modal"
          defaultChecked
          onChange={(event) => {
            if (!event.target.checked) navigateToConfigure();
          }}
        />
        <div>
          <div className="card">
            <label htmlFor="modal-control" className="modal-close"></label>
            <h3 className="section">Error</h3>

            <div className="section">
              <p>The remote server returned an error: {errorElement}</p>
              {description && <blockquote>{description}</blockquote>}
            </div>
          </div>
        </div>
      </>
    );
  }

  const code = searchParams.get("code");
  if (code === null) {
    return (
      <>
        <input
          type="checkbox"
          id="modal-control"
          className="modal"
          defaultChecked
          onChange={(event) => {
            if (!event.target.checked) navigateToConfigure();
          }}
        />
        <div>
          <div className="card">
            <label htmlFor="modal-control" className="modal-close"></label>
            <h3 className="section">Error</h3>

            <div className="section">
              <p>
                The remote server did not return the <code>code</code>
                parameter.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const decodedState: State = JSON.parse(atob(state));

  useEffect(() => {
    if (decodedState.p) {
      axios
        .post(decodedState.p, {
          target: decodedState.t,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: decodedState.r ? window.location.href : undefined,
          username: decodedState.i,
          password: decodedState.s,
        })
        .then((response) => setTokenResponse(response.data))
        .catch((error) => console.error(error));
    } else {
      axios
        .postForm(
          decodedState.t,
          {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: decodedState.r ? window.location.href : undefined,
          },
          { auth: { username: decodedState.i, password: decodedState.s } }
        )
        .then((response) => setTokenResponse(response.data))
        .catch((error: AxiosError) => setAxiosError(error));
    }
  }, []);

  if (!tokenResponse) {
    if (axiosError) {
      return (
        <div className={centralStyle.central}>
          <div className="card fluid">
            <div className="section">
              <h3>
                <mark className="secondary">{axiosError.code}</mark>
                <small>{axiosError.message}</small>
              </h3>
            </div>
            {axiosError.response && (
              <div className="section">
                <p>Server response:</p>
                <pre>{JSON.stringify(axiosError.response.data)}</pre>
              </div>
            )}
            <div className="section centered">
              <Link role="button" to={configureFragment} className="primary">
                Start again
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={centralStyle.central}>
          <div className="card fluid">
            <div className="section">
              <h3>
                <span>Token Unavailable</span>
                <small>Unknown Error</small>
              </h3>
            </div>
            <div className="section centered">
              <Link role="button" to={configureFragment} className="primary">
                Start again
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  const expireTime = new Date(
    new Date().getTime() + tokenResponse.expires_in * 1000
  );

  return (
    <div className={`large-container ${centralStyle.central}`}>
      <div className="card fluid shadow">
        <div className="section">
          <h1>
            Result <small>Got a {tokenResponse.token_type} token!</small>
          </h1>
          <div className="collapse">
            <input
              type="checkbox"
              id="collapse-access-token"
              aria-hidden="true"
              defaultChecked={false}
            />
            <label htmlFor="collapse-access-token" aria-hidden>
              Access Token
            </label>
            <div>
              <textarea readOnly rows={5} value={tokenResponse.access_token} />
              <p>{`This token expires at ${expireTime.toLocaleString()}`}</p>
            </div>
            <input
              type="checkbox"
              id="collapse-refresh-token"
              aria-hidden="true"
              defaultChecked={false}
            />
            <label htmlFor="collapse-refresh-token" aria-hidden>
              Refresh Token
            </label>
            <div>
              <textarea readOnly value={tokenResponse.refresh_token} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
