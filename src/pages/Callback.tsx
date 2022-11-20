import { useSearchParams } from "react-router-dom";

export default function Callback() {
  const [searchParams, _] = useSearchParams();

  // todo: post request in useEffect

  return (
    <div>
      <p>
        Code: <pre>{searchParams.get("code")}</pre>
      </p>
      <p>
        State: <pre>{searchParams.get("state")}</pre>
      </p>
    </div>
  );
}
