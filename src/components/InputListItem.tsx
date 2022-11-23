import { ChangeEvent } from "react";
import style from "./InputList.module.css";

interface InputListItemProps {
  id: string;
  value: string;
  onDelete: (id: string) => void;
  onChange: (id: string, newValue: string) => void;
}

export default function InputListItem({
  id,
  value,
  onDelete,
  onChange,
}: InputListItemProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  };

  return (
    <li>
      <input
        className={style.expansive}
        value={value}
        type="text"
        id="client_secret"
        onChange={handleChange}
      />
      <button type="button" className="small" onClick={() => onDelete(id)}>
        <b>－</b>
      </button>
    </li>
  );
}
