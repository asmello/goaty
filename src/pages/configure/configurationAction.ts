import { ActionFunctionArgs, json } from "react-router-dom";
import { ErrorData } from "../Error";

function tryExtract(data: FormData, field: string): string {
  const value = data.get(field)?.toString();
  if (!value) {
    throw json<ErrorData>(
      {
        header: "Incomplete",
        body: `Configuration is missing the required ${field} field.`,
      },
      400
    );
  }
  return value;
}

export async function configurationAction({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const targetUrl = new URL(tryExtract(data, "authzEndpoint"));
  targetUrl.searchParams.set("response_type", "code");
  targetUrl.searchParams.set("client_id", tryExtract(data, "clientId"));
  targetUrl.searchParams.set("state", tryExtract(data, "state"));

  const sendUri = data.get("sendUri")?.toString();
  if (sendUri === "on") {
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
