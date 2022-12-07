import { json } from "react-router-dom";
import { ErrorData } from "../pages/Error";

export function fallibleExtractFromPostData(
  data: FormData,
  field: string
): string {
  const value = data.get(field)?.toString();
  if (!value) {
    throw json<ErrorData>(
      {
        kind: "MissingParameter",
        parameter: field,
      },
      400
    );
  }
  return value;
}

export function trySetPersistentItem(
  key: string,
  value: string | object | boolean
): boolean {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  try {
    window.localStorage.setItem(key, str);
  } catch (error) {
    console.warn(`Could not store key ${key} to persistent state.`);
    return false;
  }
  return true;
}

export function trySetEphemeralItem(
  key: string,
  value: string | object
): boolean {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  try {
    window.sessionStorage.setItem(key, str);
  } catch (error) {
    console.warn(`Could not store key ${key} to session state.`);
    return false;
  }
  return true;
}
