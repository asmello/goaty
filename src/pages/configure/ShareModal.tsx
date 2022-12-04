import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { decode, encode, isValidState } from "../../common/State";
import {
  ConfigurationData,
  convertConfigurationToState,
  convertStateToConfiguration,
} from "./Configuration";
import style from "./ShareModal.module.css";

export type ShareModalState = "CLOSED" | "OPEN" | "SUCCESS" | "FAILED";

interface ShareModalProps {
  configuration: ConfigurationData;
  onConfigurationChanged: (newConfiguration: ConfigurationData) => void;
  modalState: ShareModalState;
  onModalStateChanged: (newState: ShareModalState) => void;
}

export default function ShareModal({
  configuration,
  onConfigurationChanged,
  modalState,
  onModalStateChanged,
}: ShareModalProps) {
  const getDerivedState = () =>
    encode(convertConfigurationToState(configuration));

  const [state, setState] = useState(getDerivedState);

  useEffect(() => {
    if (modalState === "OPEN") {
      // On open, we reset the state string if it is not valid
      const derivedState = getDerivedState();
      if (state !== derivedState) {
        setState(derivedState);
      }
    }
  }, [modalState]);

  const copyShareLink = async () => {
    return navigator.clipboard
      .writeText(state)
      .then(() => onModalStateChanged("SUCCESS"))
      .catch(() => onModalStateChanged("FAILED"));
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    const decoded = decode(newState);
    if (decoded && isValidState(decoded)) {
      onConfigurationChanged(convertStateToConfiguration(decoded));
    }
  };

  return (
    <dialog open={modalState !== "CLOSED"}>
      <article>
        <header>
          <a
            aria-label="Close"
            className="close"
            onClick={() => onModalStateChanged("CLOSED")}
          />
          Configuration Sharing
        </header>
        <p>The value below may contain your client secret.</p>
        <p>
          Keep it safe and <b>do not share with unauthorized parties</b>.
        </p>
        <p id={style.stateField}>
          <input
            type="text"
            value={state}
            onChange={(event) => handleStateChange(event.target.value)}
          />
          <button
            role="button"
            className="inline secondary"
            onClick={copyShareLink}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </p>
      </article>
    </dialog>
  );
}
