import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import State from "../common/State";
import style from "./Callback.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

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
  const [expireTime, setExpireTime] = useState<Date>();

  if (state === null) {
    return (
      <dialog open>
        <article>
          <header className="centered-text">Error</header>
          <p>
            The <code>state</code> parameter is missing.
          </p>
          <footer className="centered-text">
            <button
              className="inline"
              role="button"
              onClick={() => navigate("/configure")}
            >
              Start over
            </button>
          </footer>
        </article>
      </dialog>
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
      <dialog open>
        <article>
          <header className="centered-text">Error</header>
          <p>The remote server returned an error: {errorElement}</p>
          {description && <blockquote>{description}</blockquote>}
          <footer className="centered-text">
            <button
              className="inline"
              role="button"
              onClick={navigateToConfigure}
            >
              Start over
            </button>
          </footer>
        </article>
      </dialog>
    );
  }

  const code = searchParams.get("code");
  if (code === null) {
    return (
      <dialog open>
        <article>
          <header className="centered-text">Error</header>
          <p>
            The remote server did not return the <code>code</code> parameter.
          </p>
          <footer className="centered-text">
            <button
              className="inline"
              role="button"
              onClick={navigateToConfigure}
            >
              Start over
            </button>
          </footer>
        </article>
      </dialog>
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

  useEffect(() => {
    if (tokenResponse) {
      setExpireTime(
        new Date(new Date().getTime() + tokenResponse.expires_in * 1000)
      );
    }
  }, [tokenResponse]);

  if (!tokenResponse) {
    if (axiosError) {
      return (
        <dialog open>
          <article>
            <header className="centered-text">
              <hgroup>
                <h1>
                  <mark className="error">{axiosError.code}</mark>
                </h1>
                <h2>{axiosError.message}</h2>
              </hgroup>
            </header>
            {axiosError.response && (
              <>
                <p>Server response:</p>
                <pre className="wrap">
                  {JSON.stringify(axiosError.response.data, null, "  ")}
                </pre>
              </>
            )}
            <footer className="centered-text">
              <button
                className="inline"
                role="button"
                onClick={navigateToConfigure}
              >
                Start over
              </button>
            </footer>
          </article>
        </dialog>
      );
    } else {
      return (
        <dialog open>
          <article className="centered-text">
            <header className="oneliner">
              <h1>Token Unavailable</h1>
            </header>
            <p>Unknown Error</p>
            <footer className="centered-text">
              <button
                className="inline"
                role="button"
                onClick={navigateToConfigure}
              >
                Start over
              </button>
            </footer>
          </article>
        </dialog>
      );
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("SUCCESS"))
      .catch(() => console.log("FAILED"));
  };

  return (
    <div className="centered">
      <article className={style.result}>
        <hgroup>
          <h1>Success</h1>
          <h2>Got a {tokenResponse.token_type} token!</h2>
        </hgroup>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(tokenResponse.access_token)}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </button>
            <span>Access Token</span>
          </summary>
          <textarea
            className="code"
            readOnly
            rows={5}
            value={tokenResponse.access_token}
          />
          {expireTime && (
            <p>{`This token expires at ${expireTime.toLocaleString()}`}</p>
          )}
        </details>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(tokenResponse.refresh_token)}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </button>
            <span>Refresh Token</span>
          </summary>
          <textarea
            className="code"
            readOnly
            value={tokenResponse.refresh_token}
          />
        </details>
      </article>
    </div>
  );
}
