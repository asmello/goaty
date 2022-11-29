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
    <>
      <mark className="error">{error.status}</mark> {error.statusText}
    </>
  ) : (
    error.message
  );

  let message;
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        message = "Not all who wander are lost. But you certainly are.";
        break;
      default:
        message = "Houston, we've got a problem.";
        break;
    }
  } else {
    message = "Houston, we've got a problem.";
  }

  return (
    <div className="centered">
      <article className="centered-text">
        <header className="oneliner">
          <h2>{header}</h2>
        </header>
        <p>{message}</p>
        <footer>
          <Link role="button" to="/">
            Go home
          </Link>
        </footer>
      </article>
    </div>
  );
}
