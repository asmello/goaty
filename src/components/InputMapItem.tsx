import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";
import style from "./InputMapItem.module.css";

export interface MapItem {
  id: string;
  key: string;
  value: string;
}

interface InputMapItemProps {
  item: MapItem;
  isConflicting: boolean;
  onDelete: (id: string) => void;
  onKeyChange: (id: string, newKey: string) => void;
  onValueChange: (id: string, newValue: string) => void;
}

export default function InputMapItem({
  item,
  isConflicting,
  onDelete,
  onKeyChange,
  onValueChange,
}: InputMapItemProps) {
  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    onKeyChange(item.id, event.target.value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange(item.id, event.target.value);
  };

  const keyClass = isConflicting ? style.conflicting : "";

  return (
    <div className={style.item}>
      <input
        type="text"
        value={item.key}
        onChange={handleKeyChange}
        placeholder="key"
        className={keyClass}
      />
      <input
        type="text"
        value={item.value}
        onChange={handleValueChange}
        placeholder="value"
      />
      <button
        type="button"
        className={style.removeButton}
        onClick={() => onDelete(item.id)}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
    </div>
  );
}
