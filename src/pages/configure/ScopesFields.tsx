import InputList from "../../components/InputList";
import { Item } from "../../components/InputListItem";
import { v4 as uuid } from "uuid";

interface ScopesFieldsProps {
  scopes: Item[];
  onScopesChange: (newScopes: Item[]) => void;
}

export default function ScopesFields({
  scopes,
  onScopesChange,
}: ScopesFieldsProps) {
  const handleItemDelete = (id: string) => {
    onScopesChange(scopes.filter((scope) => scope.id !== id));
  };
  const handleItemChange = (id: string, newValue: string) => {
    onScopesChange(
      scopes.map((scope) =>
        scope.id === id ? { id: id, value: newValue } : scope
      )
    );
  };
  const handleItemCreate = () => {
    onScopesChange(scopes.concat([{ id: uuid(), value: "" }]));
  };

  return (
    <fieldset className="visible">
      <legend>Scopes</legend>
      <InputList
        items={scopes}
        onCreate={handleItemCreate}
        onChange={handleItemChange}
        onDelete={handleItemDelete}
      />
      <input
        name="scopes"
        type="hidden"
        value={scopes.map(({ value }) => value).join(" ")}
      />
    </fieldset>
  );
}
