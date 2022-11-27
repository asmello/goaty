import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import "./Root.css";
import { useState } from "react";

export default function Root() {
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
                <FontAwesomeIcon icon={faMoon} />
              </label>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        Find me at <a href="https://github.com/asmello/goaty">Github</a>.
      </footer>
    </>
  );
}
