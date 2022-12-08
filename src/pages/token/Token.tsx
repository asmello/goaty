import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActionData, useNavigate } from "react-router-dom";
import { TokenData } from "./action";

export default function () {
  const data = useActionData() as TokenData | undefined;
  const navigate = useNavigate();

  if (data === undefined) {
    return (
      <dialog open>
        <article>
          <header className="centered-text">Expired</header>
          Your token request has expired.
          <footer className="centered-text">
            <button
              className="inline"
              role="button"
              onClick={() => navigate(-1)}
            >
              Go back
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
      <article>
        <hgroup>
          <h1>Success</h1>
          <h2>Got a {data.tokenType} token!</h2>
        </hgroup>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(data.accessToken)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <span>Access Token</span>
          </summary>
          <p>Used to access API resources on behalf of the user.</p>
          <textarea
            className="code"
            readOnly
            rows={5}
            value={data.accessToken}
          />
          <p>{`This token expires at ${data.resolvedExpireTime.toLocaleString()}`}</p>
        </details>

        <details>
          <summary className="copyable">
            <button
              className="inline small"
              role="button"
              onClick={() => copyToClipboard(data.refreshToken)}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <span>Refresh Token</span>
          </summary>
          <p>Used to renew the access token when close to expiring.</p>
          <textarea className="code" readOnly value={data.refreshToken} />
        </details>
      </article>
    </div>
  );
}
