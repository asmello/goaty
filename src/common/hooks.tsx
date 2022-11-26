import { v4 as uuid } from "uuid";
import { useState } from "react";
import InputList from "../components/InputList";
import InputMap from "../components/InputMap";
import { MapItem } from "../components/InputMapItem";
import { Item } from "../components/InputListItem";

export function useInputList(): [
  Item[],
  (newItems: Item[]) => void,
  JSX.Element
] {
  const [items, setItems] = useState<Item[]>([]);

  const handleItemDelete = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };
  const handleItemChange = (id: string, newValue: string) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { id: id, value: newValue } : item))
    );
  };
  const handleItemCreate = () => {
    setItems((items) => items.concat([{ id: uuid(), value: "" }]));
  };

  const component = (
    <InputList
      items={items}
      onCreate={handleItemCreate}
      onChange={handleItemChange}
      onDelete={handleItemDelete}
    />
  );

  return [items, setItems, component];
}

export function useInputMap(): [
  MapItem[],
  (newItems: MapItem[]) => void,
  JSX.Element
] {
  const [items, setItems] = useState<MapItem[]>([]);

  const handleItemDelete = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };
  const handleKeyChange = (id: string, newKey: string) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, key: newKey } : item))
    );
  };
  const handleValueChange = (id: string, newValue: string) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };
  const handleItemCreate = () => {
    setItems((items) => [...items, { id: uuid(), key: "", value: "" }]);
  };

  const component = (
    <InputMap
      items={items}
      onCreate={handleItemCreate}
      onKeyChange={handleKeyChange}
      onValueChange={handleValueChange}
      onDelete={handleItemDelete}
    />
  );

  return [items, setItems, component];
}
