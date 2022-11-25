import { useInputMap } from "../../common/hooks";
import { MapItem } from "../../components/InputMapItem";

export function useExtras(): [MapItem[], JSX.Element] {
  const [extras, extrasComponent] = useInputMap();

  const component = (
    <div className="row">
      <fieldset>
        <>
          <legend>Extra Parameters</legend>
          {extrasComponent}
        </>
      </fieldset>
    </div>
  );

  return [extras, component];
}
