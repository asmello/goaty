import {
  useRouteError,
  isRouteErrorResponse,
  Link,
  useNavigate,
} from "react-router-dom";

export interface ErrorData {
  header: string;
  body: string;
}

// react-router-dom doesn't publish this for whatever dumb reason
interface ErrorResponse {
  status: number;
  statusText: string;
  data: ErrorData;
}

function defaultMessage(status: number) {
  switch (status) {
    case 404:
      return <p>Not all who wander are lost. But you certainly are.</p>;
    default:
      return <p>Houston, we've got a problem.</p>;
  }
}

function renderErrorResponse(error: ErrorResponse) {
  const header = (
    <h2>
      <mark className="error">{error.status}</mark>{" "}
      {error.data.header || error.statusText}
    </h2>
  );
  const body = error.data.body || defaultMessage(error.status);
  return { header: header, body: body };
}

function renderError(error: Error) {
  const header = (
    <hgroup>
      <h2>{error.name}</h2>
      <h3>{error.message}</h3>
    </hgroup>
  );
  const body = (
    <>
      {error.stack && (
        <figure>
          <pre>{error.stack}</pre>
        </figure>
      )}
    </>
  );
  return { header: header, body: body };
}

export default function Error() {
  const error = useRouteError() as Error | ErrorResponse;
  const { header, body } = isRouteErrorResponse(error)
    ? renderErrorResponse(error)
    : renderError(error);
  const navigate = useNavigate();

  return (
    <div className="centered centered-text">
      <article>
        <header>{header}</header>
        {body}
        <footer>
          <button type="button" className="inline" onClick={() => navigate(-1)}>
            Go back
          </button>
        </footer>
      </article>
    </div>
  );
}
