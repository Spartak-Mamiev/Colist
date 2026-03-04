import style from "./List.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import Button from "../button/Button";

export default function List({ name, creator }) {
  return (
    <div className={style.listContainer}>
      <div className={style.listNameContainer}>
        <h3>{name}</h3>
        <p>Created by {creator}</p>
      </div>
      <Button variant="transparent">
        <FaRegTrashAlt fill="red"  />
      </Button>
    </div>
  );
}
