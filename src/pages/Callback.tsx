import { useState, useEffect, ChangeEvent } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router-dom";

export default function Callback() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  if (searchParams.get("error")) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.checked) {
        navigate("/start");
      }
    };

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
          onChange={handleChange}
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

  // todo: post request in useEffect

  return (
    <div>
      <p>
        Code: <code>{searchParams.get("code")}</code>
      </p>
      <p>
        State: <code>{searchParams.get("state")}</code>
      </p>
    </div>
  );
}
