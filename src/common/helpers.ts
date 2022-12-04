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
