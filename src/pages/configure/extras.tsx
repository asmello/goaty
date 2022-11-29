import { useInputMap } from "../../common/hooks";
import { MapItem } from "../../components/InputMapItem";

export function useExtras(): [
  MapItem[],
  (newExtras: MapItem[]) => void,
  JSX.Element
] {
  const [extras, setExtras, extrasComponent] = useInputMap();

  const component = (
    <fieldset className="visible">
      <legend>Extra Parameters</legend>
      {extrasComponent}
      <input
        name="extras"
        type="hidden"
        value={JSON.stringify(extras.map(({ key, value }) => [key, value]))}
      />
    </fieldset>
  );

  return [extras, setExtras, component];
}
