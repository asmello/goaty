import { Link } from "react-router-dom";
// import style from "../common/central.module.css";

export default function Home() {
  return (
    <div className="centered centered-text">
      <article>
        <hgroup>
          <h1>🐐 GOATY</h1>
          <h2>The Generic OAuth2 Token Yanker</h2>
        </hgroup>
        <Link to="authz" role="button" className="primary">
          Get started
        </Link>
      </article>
    </div>
  );
}
