import { useInputList } from "../../common/hooks";
import { Item } from "../../components/InputListItem";

export function useScopes(): [Item[], JSX.Element] {
  const [scopes, scopesComponent] = useInputList();

  const wrappedComponent = (
    <div className="row">
      <fieldset>
        <>
          <legend>Scopes</legend>
          {scopesComponent}
        </>
      </fieldset>
    </div>
  );

  return [scopes, wrappedComponent];
}
