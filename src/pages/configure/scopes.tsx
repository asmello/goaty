import { useInputList } from "../../common/hooks";
import { Item } from "../../components/InputListItem";

export function useScopes(): [
  Item[],
  (newScopes: Item[]) => void,
  JSX.Element
] {
  const [scopes, setScopes, scopesComponent] = useInputList();

  const wrappedComponent = (
    <fieldset className="visible">
      <>
        <legend>Scopes</legend>
        {scopesComponent}
      </>
    </fieldset>
  );

  return [scopes, setScopes, wrappedComponent];
}
