import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

interface MissingParameterError {
  kind: "MissingParameter";
  parameter: string;
}

interface InvalidParameterError {
  kind: "InvalidParameter";
  parameter: string;
}

interface InvalidHttpMethodError {
  kind: "InvalidHttpMethod";
  message: string;
}

interface RemoteError {
  kind: "RemoteError";
  name: string;
  description?: string;
  link?: string;
}

interface GenericRemoteError {
  kind: "GenericRemoteError";
  message: string;
  response?: string;
}

interface UnknownError {
  kind: "UnknownError";
}

export type ErrorData =
  | MissingParameterError
  | InvalidParameterError
  | InvalidHttpMethodError
  | RemoteError
  | GenericRemoteError
  | UnknownError;

// react-router-dom doesn't publish this for whatever dumb reason
interface ErrorResponse {
  status: number;
  statusText: string;
  data: ErrorData;
}

export interface RemoteErrorPayload {
  error: string;
  error_description?: string;
  error_uri?: string;
}

export function isRemoteErrorPayload(data: any): data is RemoteErrorPayload {
  return (data as RemoteErrorPayload).error !== undefined;
}

function defaultMessage(status: number) {
  switch (status) {
    case 404:
      return <p>Not all who wander are lost. But you certainly are.</p>;
  }
}

function renderMissingParameterError(error: MissingParameterError) {
  return {
    header: <h2>Missing Parameter</h2>,
    body: (
      <p>
        Parameter <code>{error.parameter}</code> is missing.
      </p>
    ),
  };
}

function renderRemoteError(status: number, error: RemoteError) {
  return {
    header: (
      <h2>
        <mark className="error">{status}</mark> {error.name}
      </h2>
    ),
    body: <p>{error.description || "Remote Error"}</p>,
  };
}

function renderGenericRemoteError(error: GenericRemoteError) {
  return {
    header: <h2>{error.message}</h2>,
    body: <p>{error.response || "Remote Error"}</p>,
  };
}

function renderErrorResponse(error: ErrorResponse) {
  switch (error.data.kind) {
    case "MissingParameter":
      return renderMissingParameterError(error.data);
    case "RemoteError":
      return renderRemoteError(error.status, error.data);
    case "GenericRemoteError":
      return renderGenericRemoteError(error.data);
    default:
      const header = (
        <h2>
          Error <mark className="error">{error.status}</mark>
        </h2>
      );
      const body = defaultMessage(error.status) || (
        <p>Context: {error.statusText || error.data.kind}</p>
      );
      return { header: header, body: body };
  }
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
