import style from "./InputList.module.css";
import InputListItem from "./InputListItem";

export interface Item {
  id: string;
  value: string;
}

interface InputListProps {
  label: string;
  items: Item[];
  onChange: (id: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function InputList({
  label,
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
    <div className={style.inputList}>
      <div className={style.header}>
        <span className={style.expansive}>{label}</span>
        <button
          type="button"
          id={style.addButton}
          className="small"
          onClick={onCreate}
        >
          <b>＋</b>
        </button>
      </div>

      <ul role="list">{values}</ul>
    </div>
  );
}
