import InputMap from "../../components/InputMap";
import { MapItem } from "../../components/InputMapItem";
import { v4 as uuid } from "uuid";

interface ExtrasFieldsProps {
  extras: MapItem[];
  onExtrasChanged: (newExtras: MapItem[]) => void;
}

export default function ExtrasFields({
  extras,
  onExtrasChanged,
}: ExtrasFieldsProps) {
  const handleItemDelete = (id: string) => {
    onExtrasChanged(extras.filter((item) => item.id !== id));
  };
  const handleKeyChange = (id: string, newKey: string) => {
    onExtrasChanged(
      extras.map((item) => (item.id === id ? { ...item, key: newKey } : item))
    );
  };
  const handleValueChange = (id: string, newValue: string) => {
    onExtrasChanged(
      extras.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };
  const handleItemCreate = () => {
    onExtrasChanged([...extras, { id: uuid(), key: "", value: "" }]);
  };
  return (
    <fieldset className="visible">
      <legend>Extra Parameters</legend>
      <InputMap
        items={extras}
        onCreate={handleItemCreate}
        onKeyChange={handleKeyChange}
        onValueChange={handleValueChange}
        onDelete={handleItemDelete}
      />
      <input
        name="extras"
        type="hidden"
        value={JSON.stringify(extras.map(({ key, value }) => [key, value]))}
      />
    </fieldset>
  );
}
