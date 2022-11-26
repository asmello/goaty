import { ChangeEvent } from "react";

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
    <div className="row">
      <div className="col-sm-10">
        <input type="text" value={value} onChange={handleChange} />
      </div>
      <div className="col-sm">
        <button type="button" className="small" onClick={() => onDelete(id)}>
          <b>－</b>
        </button>
      </div>
    </div>
  );
}
