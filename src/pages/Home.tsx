import { Link } from "react-router-dom";
import style from "../common/central.module.css";

export default function Home() {
  return (
    <div className={style.central}>
      <div className="row">
        <div className="card fluid">
          <div className="section">
            <div className={style.center}>
              <h1>
                🐐 GOATY <small>The Generic OAuth2 Token Yanker</small>
              </h1>
              <Link to="start" role="button" className="primary">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
