import {
  faBrush,
  faCircleHalfStroke,
  faFloppyDisk,
  faGear,
  faHourglassHalf,
  faInfinity,
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import {
  trySetEphemeralItem,
  trySetPersistentItem,
} from "../../common/helpers";
import Breadcrumbs from "../../components/Breadcrumbs";

export const STATE_KEY = "rootState";

type PersistMode = "NONE" | "SESSION" | "LOCAL";
type Theme = "SYSTEM" | "LIGHT" | "DARK";

export interface RootState {
  persistMode: PersistMode;
  theme: Theme;
}

interface RootProps {
  children?: JSX.Element;
}

function moveFromTo(fromStorage: Storage, toStorage: Storage) {
  toStorage.clear();
  for (let i = 0; i < fromStorage.length; ++i) {
    const keyName = fromStorage.key(i) as string;
    const value = fromStorage.getItem(keyName) as string;
    toStorage.setItem(keyName, value);
  }
  fromStorage.clear();
}

export default function Root({ children }: RootProps) {
  const loadedState = useLoaderData() as RootState;
  const [state, setState] = useState(loadedState);

  useEffect(() => {
    switch (state.persistMode) {
      case "SESSION":
        trySetEphemeralItem(STATE_KEY, state);
        break;
      case "LOCAL":
        trySetPersistentItem(STATE_KEY, state);
        break;
    }
  }, [state]);

  useEffect(() => {
    const htmlRoot = document.documentElement;
    switch (state.theme) {
      case "SYSTEM":
        htmlRoot.removeAttribute("data-theme");
        break;
      case "LIGHT":
        htmlRoot.setAttribute("data-theme", "light");
        break;
      case "DARK":
        htmlRoot.setAttribute("data-theme", "dark");
        break;
    }
  }, [state]);

  const handlePersistChange = (event: ChangeEvent<HTMLInputElement>) => {
    const persistMode = event.target.value as PersistMode;
    switch (persistMode) {
      case "NONE":
        window.sessionStorage.clear();
        window.localStorage.clear();
        break;
      case "SESSION":
        moveFromTo(localStorage, sessionStorage);
        break;
      case "LOCAL":
        moveFromTo(sessionStorage, localStorage);
        break;
    }
    setState({ ...state, persistMode });
  };

  const handleThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, theme: event.target.value as Theme });
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
              <details role="list">
                <summary aria-haspopup="listbox">
                  <span>
                    <FontAwesomeIcon icon={faGear} /> Settings
                  </span>
                </summary>
                <ul role="listbox">
                  <li className="divisor">
                    <FontAwesomeIcon icon={faBrush} /> Theme
                  </li>
                  <li>
                    <fieldset>
                      <label>
                        <input
                          type="radio"
                          name="darkmode"
                          value="SYSTEM"
                          checked={state.theme === "SYSTEM"}
                          onChange={handleThemeChange}
                        />
                        <FontAwesomeIcon icon={faCircleHalfStroke} /> System
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="darkmode"
                          value="LIGHT"
                          checked={state.theme === "LIGHT"}
                          onChange={handleThemeChange}
                        />
                        <FontAwesomeIcon icon={faSun} /> Light
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="darkmode"
                          value="DARK"
                          checked={state.theme === "DARK"}
                          onChange={handleThemeChange}
                        />
                        <FontAwesomeIcon icon={faMoon} /> Dark
                      </label>
                    </fieldset>
                  </li>
                  <li className="divisor">
                    <FontAwesomeIcon icon={faFloppyDisk} />{" "}
                    <span
                      data-tooltip="Your settings and configuration parameters will be stored locally."
                      data-placement="left"
                    >
                      Remember
                    </span>
                  </li>
                  <li>
                    <fieldset>
                      <label>
                        <input
                          type="radio"
                          name="state"
                          value="NONE"
                          checked={state.persistMode === "NONE"}
                          onChange={handlePersistChange}
                        />
                        <FontAwesomeIcon icon={faXmark} /> Never
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="state"
                          value="SESSION"
                          checked={state.persistMode === "SESSION"}
                          onChange={handlePersistChange}
                        />
                        <FontAwesomeIcon icon={faHourglassHalf} /> Session
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="state"
                          value="LOCAL"
                          checked={state.persistMode === "LOCAL"}
                          onChange={handlePersistChange}
                        />
                        <FontAwesomeIcon icon={faInfinity} /> Forever
                      </label>
                    </fieldset>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children || <Outlet context={state} />}</main>
      <footer>
        Find me at <a href="https://github.com/asmello/goaty">Github</a>.
      </footer>
    </>
  );
}
