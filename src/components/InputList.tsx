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
      <div className="row">
        <button type="button" className="small add-button" onClick={onCreate}>
          <b>+</b>
        </button>
      </div>
    </>
  );
}
