import { ReactNode } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import State from "../common/State";
import style from "./Callback.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface Data {
  tokenResponse: TokenResponse;
  resolvedExpireTime: Date;
}

interface Error {
  title: ReactNode;
  description: ReactNode;
  link?: string;
}

function isError(maybeError: Data | Error): maybeError is Error {
  return "title" in maybeError && "description" in maybeError;
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Data | Error> {
  const requestUrl = new URL(request.url);
  const state = requestUrl.searchParams.get("state");
  if (!state) {
    return {
      title: "Error",
      description: (
        <p>
          The <code>state</code> parameter is missing.
        </p>
      ),
    };
  }

  const error = requestUrl.searchParams.get("error");
  if (error) {
    const description = requestUrl.searchParams.get("error_description");
    const errorUri = requestUrl.searchParams.get("error_uri");
    const errorElement =
      errorUri === null ? (
        <code>{error}</code>
      ) : (
        <a href={errorUri}>
          <code>{error}</code>
        </a>
      );
    return {
      title: "Error",
      description: (
        <>
          <p>The remote server returned an error: {errorElement}</p>
          {description && <blockquote>{description}</blockquote>}
        </>
      ),
      link: `/configure?state=${state}`,
    };
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return {
      title: "Error",
      description: (
        <p>
          The remote server did not return the <code>code</code> parameter.
        </p>
      ),
    };
  }

  const decodedState: State = JSON.parse(window.atob(state));

  let tokenResponse;
  try {
    tokenResponse = await (decodedState.p
      ? axios.post<any, TokenResponse>(decodedState.p, {
          target: decodedState.t,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: decodedState.r ? window.location.href : undefined,
          username: decodedState.i,
          password: decodedState.s,
        })
      : axios.postForm<any, TokenResponse>(
          decodedState.t,
          {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: decodedState.r ? window.location.href : undefined,
          },
          { auth: { username: decodedState.i, password: decodedState.s } }
        ));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        title: (
          <hgroup>
            <h1>
              <mark className="error">{error.code}</mark>
            </h1>
            <h2>{error.message}</h2>
          </hgroup>
        ),
        description: error.response && (
          <>
            <p>Server response:</p>
            <pre className="wrap">
              {JSON.stringify(error.response.data, null, "  ")}
            </pre>
          </>
        ),
      };
    } else {
      return {
        title: "Token Unavailable",
        description: <p>Unknown Error</p>,
      };
    }
  }

  return {
    tokenResponse: tokenResponse,
    resolvedExpireTime: new Date(
      new Date().getTime() + tokenResponse.expires_in * 1000
    ),
  };
}

export default function Callback() {
  const navigate = useNavigate();
  const data = useLoaderData() as Data | Error;

  if (isError(data)) {
    return (
      <dialog open>
        <article>
          <header className="centered-text">{data.title}</header>
          {data.description}
          <footer className="centered-text">
            <button
              className="inline"
              role="button"
              onClick={() => navigate(data.link ?? "/configure")}
            >
              Start over
            </button>
          </footer>
        </article>
      </dialog>
    );
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
          <h2>Got a {data.tokenResponse.token_type} token!</h2>
        </hgroup>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(data.tokenResponse.access_token)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <span>Access Token</span>
          </summary>
          <textarea
            className="code"
            readOnly
            rows={5}
            value={data.tokenResponse.access_token}
          />
          <p>{`This token expires at ${data.resolvedExpireTime.toLocaleString()}`}</p>
        </details>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(data.tokenResponse.refresh_token)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <span>Refresh Token</span>
          </summary>
          <textarea
            className="code"
            readOnly
            value={data.tokenResponse.refresh_token}
          />
        </details>
      </article>
    </div>
  );
}
