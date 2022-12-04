import { ReactNode } from "react";
import { useMatches } from "react-router-dom";

interface MatchHandle {
  crumbs?: ReactNode[];
}

export default function () {
  const matches = useMatches();
  const currentMatch = matches.at(-1);
  if (!currentMatch) {
    return <></>;
  }
  const handle = currentMatch.handle as MatchHandle;
  if (!handle) {
    return <></>;
  }
  const crumbs = handle.crumbs;
  if (!crumbs) {
    return <></>;
  }

  return (
    <nav aria-label="breadcrumb">
      <ul>
        {crumbs.map((crumb, idx) => (
          <li key={idx}>
            <span>{crumb}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
