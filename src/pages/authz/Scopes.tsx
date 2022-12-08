import { v4 as uuid } from "uuid";
import InputList from "../../components/InputList";
import { Item } from "../../components/InputListItem";

interface ScopesProps {
  items: Item[];
  onChanged: (newItems: Item[]) => void;
}

export default function Scopes({ items, onChanged }: ScopesProps) {
  const handleItemDelete = (id: string) => {
    onChanged(items.filter((scope) => scope.id !== id));
  };
  const handleItemChange = (id: string, newValue: string) => {
    onChanged(
      items.map((scope) =>
        scope.id === id ? { id: id, value: newValue } : scope
      )
    );
  };
  const handleItemCreate = () => {
    onChanged(items.concat([{ id: uuid(), value: "" }]));
  };

  return (
    <fieldset className="visible">
      <legend data-tooltip="List of scopes to request.">Scopes</legend>
      <InputList
        items={items}
        onCreate={handleItemCreate}
        onChange={handleItemChange}
        onDelete={handleItemDelete}
      />
      <input
        name="scopes"
        type="hidden"
        value={items.map(({ value }) => value).join(" ")}
      />
    </fieldset>
  );
}
