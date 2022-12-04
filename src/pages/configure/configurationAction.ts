import { ActionFunctionArgs, json } from "react-router-dom";
import { ErrorData } from "../Error";

export async function configurationAction({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const authzEndpoint = data.get("authzEndpoint")?.toString();
  const clientId = data.get("clientId")?.toString();
  const state = data.get("state")?.toString();
  if (!state || !clientId || !authzEndpoint) {
    throw json<ErrorData>(
      {
        header: "Incomplete",
        body: "Configuration payload is missing one or more required fields.",
      },
      400
    );
  }

  const targetUrl = new URL(authzEndpoint);
  targetUrl.searchParams.set("response_type", "code");
  targetUrl.searchParams.set("client_id", clientId);
  targetUrl.searchParams.set("state", state);

  const sendUri = data.get("sendUri")?.toString();
  if (sendUri) {
    targetUrl.searchParams.set(
      "redirect_uri",
      window.location.href.replace(/configure.*/, "callback")
    );
  }

  const extrasString = data.get("extras")?.toString();
  if (extrasString) {
    const extras: [string, string][] = JSON.parse(extrasString);
    extras.forEach(([key, value]) => {
      targetUrl.searchParams.set(key, value);
    });
  }

  const scopes = data.get("scopes")?.toString();
  if (scopes) {
    targetUrl.searchParams.set("scope", scopes);
  }

  window.location.href = targetUrl.toString();
}
