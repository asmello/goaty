import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InputListItem, { Item } from "./InputListItem";

interface InputListProps {
  items: Item[];
  onChange: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function InputList({
  items,
  onChange,
  onDelete,
  onCreate,
}: InputListProps) {
  const values = items.map((item) => (
    <InputListItem
      key={item.id}
      id={item.id}
      value={item.value}
      onChange={onChange}
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
