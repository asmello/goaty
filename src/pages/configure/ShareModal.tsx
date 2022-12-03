export type ShareModalState = "CLOSED" | "OPEN" | "SUCCESS" | "FAILED";

interface ShareModalProps {
  shareModalState: ShareModalState;
  shareModalStateChanged: (newState: ShareModalState) => void;
  copyShareLink: () => void;
}

export default function ShareModal({
  shareModalState,
  shareModalStateChanged,
  copyShareLink,
}: ShareModalProps) {
  const shareModalContents = () => {
    switch (shareModalState) {
      case "SUCCESS":
        return {
          title: "Success",
          body: <p>The share URL has been copied to the clipboard.</p>,
        };
      case "FAILED":
        return {
          title: "Failure",
          body: (
            <>
              <p>The share URL could not be copied to the clipboard.</p>
              <p>This could be due to a permissions issue.</p>
            </>
          ),
        };
      default:
        return {
          title: "Warning",
          body: (
            <>
              <p>This URL contains your client secret.</p>
              <p>
                Keep it safe and <b>do not share with unauthorized parties</b>.
              </p>
            </>
          ),
          footer: (
            <>
              <button
                role="button"
                className="inline secondary"
                onClick={() => shareModalStateChanged("CLOSED")}
              >
                Cancel
              </button>
              <button className="inline" role="button" onClick={copyShareLink}>
                Proceed
              </button>
            </>
          ),
        };
    }
  };

  const { title, body, footer } = shareModalContents();

  return (
    <dialog open={shareModalState !== "CLOSED"}>
      <article>
        <header>
          <a
            aria-label="Close"
            className="close"
            onClick={() => shareModalStateChanged("CLOSED")}
          />
          {title}
        </header>
        {body}
        {footer && <footer>{footer}</footer>}
      </article>
    </dialog>
  );
}
