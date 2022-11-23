import { v4 as uuid } from "uuid";
import { useState } from "react";
import style from "./InputList.module.css";
import InputListItem from "./InputListItem";

interface Item {
  id: string;
  value: string;
}

interface InputListProps {
  label: string;
}

export default function InputList({ label }: InputListProps) {
  const [items, setItems] = useState<Item[]>([]);

  const handleDelete = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const handleChange = (id: string, newValue: string) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { id: id, value: newValue } : item))
    );
  };

  const handlePlusClick = () => {
    setItems((items) => items.concat([{ id: uuid(), value: "" }]));
  };

  const values = items.map((item) => (
    <InputListItem
      id={item.id}
      value={item.value}
      onChange={handleChange}
      onDelete={handleDelete}
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
          onClick={handlePlusClick}
        >
          <b>＋</b>
        </button>
      </div>

      <ul role="list">{values}</ul>
    </div>
  );
}
