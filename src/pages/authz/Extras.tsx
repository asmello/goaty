import { v4 as uuid } from "uuid";
import InputMap from "../../components/InputMap";
import { MapItem } from "../../components/InputMapItem";

interface ExtrasProps {
  items: MapItem[];
  onChanged: (newItems: MapItem[]) => void;
}

export default function Extras({ items, onChanged }: ExtrasProps) {
  const handleItemDelete = (id: string) => {
    onChanged(items.filter((item) => item.id !== id));
  };
  const handleKeyChange = (id: string, newKey: string) => {
    onChanged(
      items.map((item) => (item.id === id ? { ...item, key: newKey } : item))
    );
  };
  const handleValueChange = (id: string, newValue: string) => {
    onChanged(
      items.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };
  const handleItemCreate = () => {
    onChanged([...items, { id: uuid(), key: "", value: "" }]);
  };
  return (
    <fieldset className="visible">
      <legend data-tooltip="Include custom URL parameters in the request.">
        Extra Parameters
      </legend>
      <InputMap
        items={items}
        onCreate={handleItemCreate}
        onKeyChange={handleKeyChange}
        onValueChange={handleValueChange}
        onDelete={handleItemDelete}
      />
      <input
        name="extras"
        type="hidden"
        value={JSON.stringify(items.map(({ key, value }) => [key, value]))}
      />
    </fieldset>
  );
}
