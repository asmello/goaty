import { ActionFunctionArgs } from "react-router-dom";
import { fallibleExtractFromPostData } from "../../common/helpers";
import State, { encode } from "../../common/State";

export default async function ({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const targetUrl = new URL(fallibleExtractFromPostData(data, "authzEndpoint"));
  targetUrl.searchParams.set("response_type", "code");

  const clientId = fallibleExtractFromPostData(data, "clientId");
  targetUrl.searchParams.set("client_id", clientId);

  const sendUri = data.get("sendUri")?.toString() === "on";
  const redirectUri = window.location.href.replace(/authz.*/, "callback");
  if (sendUri) {
    targetUrl.searchParams.set("redirect_uri", redirectUri);
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

  const state: State = {
    i: clientId,
    r: sendUri ? redirectUri : undefined,
  };

  targetUrl.searchParams.set("state", encode(state));

  window.location.href = targetUrl.toString();
}
