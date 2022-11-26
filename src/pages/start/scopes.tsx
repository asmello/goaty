import { useInputList } from "../../common/hooks";
import { Item } from "../../components/InputListItem";
import style from "./scopes.module.css";

export function useScopes(): [Item[], JSX.Element] {
  const [scopes, scopesComponent] = useInputList();

  const wrappedComponent = (
    <fieldset className={style.scopes}>
      <>
        <legend>Scopes</legend>
        {scopesComponent}
      </>
    </fieldset>
  );

  return [scopes, wrappedComponent];
}
