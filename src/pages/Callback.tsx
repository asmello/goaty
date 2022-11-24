import { useEffect, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import State from "../common/State";

export default function Callback() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const handleErrorClose = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      navigate("/start");
    }
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
    // const state = searchParams.get('state');
    return (
      <>
        <input
          type="checkbox"
          id="modal-control"
          className="modal"
          defaultChecked
          onChange={handleErrorClose}
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
          onChange={handleErrorClose}
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

  const state = searchParams.get("state");
  if (state === null) {
    return (
      <>
        <input
          type="checkbox"
          id="modal-control"
          className="modal"
          defaultChecked
          onChange={handleErrorClose}
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

  const decodedState: State = JSON.parse(atob(state));

  useEffect(() => {
    axios
      .post(
        decodedState.t,
        {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: window.location.href,
        },
        { auth: { username: decodedState.i, password: decodedState.s } }
      )
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);

  // todo: post request in useEffect

  return (
    <div>
      <p>
        Code: <code>{code}</code>
      </p>
      <p>
        State: <code>{state}</code>
      </p>
    </div>
  );
}
