import { faFloppyDisk, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import { trySetPersistentItem } from "../../common/helpers";
import Breadcrumbs from "../../components/Breadcrumbs";
import { RootState, STORE_KEY } from "./loader";
import "./Root.css";

interface RootProps {
  children?: JSX.Element;
}

export default function Root({ children }: RootProps) {
  const loadedState = useLoaderData() as RootState;
  const [context, setContext] = useState(loadedState);

  const handlePersistChange = (persist: boolean) => {
    const newState = { persistEnabled: persist };
    if (persist) {
      // Move all key/value pairs to localStorage
      window.localStorage.clear();
      for (let i = 0; i < window.sessionStorage.length; ++i) {
        const keyName = window.sessionStorage.key(i) as string;
        const value = window.sessionStorage.getItem(keyName) as string;
        window.localStorage.setItem(keyName, value);
      }
      window.sessionStorage.clear();
      trySetPersistentItem(STORE_KEY, newState);
    } else {
      // Move all key/value pairs to sessionStorage
      window.sessionStorage.clear();
      for (let i = 0; i < window.localStorage.length; ++i) {
        const keyName = window.localStorage.key(i) as string;
        const value = window.localStorage.getItem(keyName) as string;
        window.sessionStorage.setItem(keyName, value);
      }
      window.localStorage.clear();
    }
    setContext(newState);
  };

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
            <li>
              <label htmlFor="stateful-mode-toggle">
                <input
                  type="checkbox"
                  id="stateful-mode-toggle"
                  role="switch"
                  checked={context.persistEnabled}
                  onChange={(event) =>
                    handlePersistChange(event.target.checked)
                  }
                />
                <FontAwesomeIcon icon={faFloppyDisk} size="lg" />
              </label>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children || <Outlet context={context} />}</main>
      <footer>
        Find me at <a href="https://github.com/asmello/goaty">Github</a>.
      </footer>
    </>
  );
}
