import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import "./Root.css";
import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

interface RootProps {
  children?: JSX.Element;
}

export default function Root({ children }: RootProps) {
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const setDarkMode = (enabled: boolean) => {
    const htmlRoot = document.documentElement;
    if (enabled) {
      htmlRoot.setAttribute("data-theme", "dark");
    } else {
      htmlRoot.setAttribute("data-theme", "light");
    }
    setDarkModeEnabled(enabled);
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/" className="button">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="button">
                About
              </NavLink>
            </li>
          </ul>
          <Breadcrumbs />
          <ul>
            <li>
              <label htmlFor="dark-mode-toggle">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  role="switch"
                  checked={darkModeEnabled}
                  onChange={(event) => setDarkMode(event.target.checked)}
                />
                <FontAwesomeIcon icon={faMoon} size="lg" />
              </label>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children || <Outlet />}</main>
      <footer>
        Find me at <a href="https://github.com/asmello/goaty">Github</a>.
      </footer>
    </>
  );
}
