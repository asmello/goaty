export default function About() {
  return (
    <article className="text-justified">
      <h1>What is this?</h1>
      <p>
        GOATY is a convenience tool designed to help web developers
        interactively learn, test and experiment with <abbr>OAuth</abbr> (Open
        Authorization) 2.0 flows. It currently only supports the explicit (or
        standard) flow.
      </p>
      <p>
        Although{" "}
        <a href="https://www.rfc-editor.org/rfc/rfc6749">
          OAuth 2.0 is a web standard
        </a>
        , server and client implementations inevitably diverge in the details,
        making each integration a new little <i>adventure</i>. Sometimes servers
        treat optional elements as mandatory, or expect extra parameters in your
        requests. Off-the-shelf clients may not be available for your
        environment, or not be customisable in the way you want. Regardless of
        the reason, occasionally we need to roll out own own clients or servers,
        and as part of the development process, we tend to interactively test or
        debug OAuth 2.0 sessions. Although one-off scripts or command-line
        heroics will do the job, this is an error-prone process, and lesser
        known protocol quirks often lead to frustration. Using this tool is a
        simple, quick and predictable way to validate your assumptions.
      </p>
      <p>
        Plus, sometimes we just need to generate one darn token, and rolling out
        a full client doesn't make sense just for that. This tool is flexible
        enough that it can also help in those cases - it comes up more often
        than developers care to admit.
      </p>
      <h1>Is this safe?</h1>
      <p>
        Yes! This entire application runs in your browser and your secrets never
        get sent to a third-party. By default no data gets recorded anywhere -
        this application is fully stateless!
      </p>
      <p>
        If you wish, you can enable statefulness in the Settings menu. This will
        record your configuration and credentials in local browser storage. You
        may choose to expire this data with your session (meaning it will be
        deleted when you close the tab) or keep it indefinitely. Most modern
        browsers encrypt local data, but you shouldn't consider that feature
        safe. Other users sharing your computer may still access the local data.{" "}
        <b>Don't store your production credentials in your browser!</b>
      </p>
      <p>
        If you wish to review or audit the source code, it can be found at{" "}
        <a href="https://github.com/asmello/goaty">Github</a>. For maximum
        security, you can also build and deploy this application from source. It
        can be served statically from an asset server, or just locally.
      </p>
      <h2>What about the Proxy feature?</h2>
      <p>
        Some OAuth 2.0 servers do not implement <abbr>CORS</abbr> (Cross-Origin
        Resource Sharing), which causes cross-origin requests driven by
        scripting in the browser to be rejected. In practice that means that an
        application running in your browser cannot request a token, preventing
        the OAuth 2.0 flow from working. One notable example is{" "}
        <a href="https://github.com/isaacs/github/issues/330">Github</a>. There
        is nothing the application can do to get around that - this is a
        security feature of your browser, and although you, as the user, could
        disable it, doing so is a bad idea.
      </p>
      <p>
        As an alternative, GOATY supports a Proxy feature. In this mode, it
        directs your Token request to a proxy server, which then forwards it to
        the intended destination. Since the server endpoint receives a
        server-to-server request, cross-origin policies do not apply, and the
        request succeeds as intended. Using this feature has no impact to your
        experience as a user, but it has important security implications. The
        proxy server must be trusted with your client secret for this
        arrangement to work. For this reason,{" "}
        <b>it is recommended to run a local proxy server</b>.
      </p>
      <h1>Is this free to use?</h1>
      <p>Yes, GOATY is free to use, share and deploy wherever you want.</p>
    </article>
  );
}
