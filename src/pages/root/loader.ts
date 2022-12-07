import { json } from "react-router-dom";

export interface RootState {
  persistEnabled: boolean;
}

export const STORE_KEY = "rootState";

export default async function (): Promise<Response> {
  const state = window.localStorage.getItem(STORE_KEY);
  if (!state) {
    return json<RootState>({
      persistEnabled: false,
    });
  }
  return new Response(state, {
    headers: {
      "Content-Type": "application/json; utf-8",
    },
  });
}
