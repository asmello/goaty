import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

// react-router-dom doesn't publish this for whatever dumb reason
interface ErrorResponse {
  status: number;
  statusText: string;
  data: any;
}

export default function Error() {
  const error = useRouteError() as Error | ErrorResponse;
  const header = isRouteErrorResponse(error) ? (
    <h2>
      <mark className="error">{error.status}</mark> {error.statusText}
    </h2>
  ) : (
    <hgroup>
      <h2>{error.name}</h2>
      <h3>{error.message}</h3>
    </hgroup>
  );

  let message;
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        message = (
          <p className="centered-text">
            Not all who wander are lost. But you certainly are.
          </p>
        );
        break;
      default:
        message = (
          <p className="centered-text">Houston, we've got a problem.</p>
        );
        break;
    }
  } else {
    message = (
      <>
        {error.stack && (
          <figure>
            <pre>{error.stack}</pre>
          </figure>
        )}
      </>
    );
  }

  return (
    <div>
      <article>
        <header className="centered-text">{header}</header>
        {message}
      </article>
    </div>
  );
}
