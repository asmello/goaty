import { json } from "react-router-dom";
import { RootState, STATE_KEY } from "./Root";

export default async function (): Promise<Response> {
  const localState = window.localStorage.getItem(STATE_KEY);
  if (localState) {
    return new Response(localState, {
      headers: {
        "Content-Type": "application/json; utf-8",
      },
    });
  }

  const sessionState = window.sessionStorage.getItem(STATE_KEY);
  if (sessionState) {
    return new Response(sessionState, {
      headers: {
        "Content-Type": "application/json; utf-8",
      },
    });
  }

  return json<RootState>({
    persistMode: "NONE",
    theme: "SYSTEM",
  });
}
