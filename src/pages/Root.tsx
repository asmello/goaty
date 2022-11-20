import { NavLink, Outlet } from "react-router-dom";
import "./Root.css";

export default function Root() {
  return (
    <div id="root-container">
      <header>
        <NavLink to="/" className="button">
          Home
        </NavLink>
        <NavLink to="/about" className="button">
          About
        </NavLink>
      </header>
      <section>
        <Outlet />
      </section>
      <footer>
        <p>
          Find me at <a href="https://github.com/asmello/goaty">Github</a>.
        </p>
      </footer>
    </div>
  );
}
