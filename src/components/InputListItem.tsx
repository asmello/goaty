import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";
import style from "./InputListItem.module.css";

export interface Item {
  id: string;
  value: string;
}

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
    <div className={style.item}>
      <input type="text" value={value} onChange={handleChange} />
      <button
        type="button"
        className={`secondary ${style.removeButton}`}
        onClick={() => onDelete(id)}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
    </div>
  );
}
