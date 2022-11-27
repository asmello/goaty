import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputMapItem, { MapItem } from "./InputMapItem";

interface InputMapProps {
  items: MapItem[];
  onKeyChange: (id: string, newKey: string) => void;
  onValueChange: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function InputMap({
  items,
  onKeyChange,
  onValueChange,
  onDelete,
  onCreate,
}: InputMapProps) {
  let conflicts = new Set<string>();
  const seenKeys = new Map<string, string>();
  for (const item of items) {
    const maybeId = seenKeys.get(item.key);
    if (maybeId) {
      conflicts.add(maybeId);
      conflicts.add(item.id);
    } else {
      seenKeys.set(item.key, item.id);
    }
  }

  const values = items.map((item) => (
    <InputMapItem
      key={item.id}
      item={item}
      isConflicting={conflicts.has(item.id)}
      onKeyChange={onKeyChange}
      onValueChange={onValueChange}
      onDelete={onDelete}
    />
  ));

  return (
    <>
      {values}
      <button type="button" className="outline secondary" onClick={onCreate}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </>
  );
}
