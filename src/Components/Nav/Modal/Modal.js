import React, { useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import TaskItem from "../../TaskItem/TaskItem";
import { useStore } from "effector-react";
import { $user } from "../../../state/user";

const admins = ['1', '29', '109', '23', '3745', '211', '3789']

export const Modal = ({ setIsOpen }) => {
  const user = useStore($user);
  const [tasks, setTasks] = useState([]);

  const applyCard = (id) => {
    if (admins.includes(user.ID) === false) return;

    const res = window.confirm("Вы уверены? Подтвердить карточку выбранного объекта?");
    if (res === true)
      fetch("https://volga24bot.com/kartoteka/api/tech/CheckCard/applyCard.php?id=" + id)
        .then(_ => fetch("https://volga24bot.com/kartoteka/api/tech/CheckCard/getNotCorrectCard.php")
          .then(res => res.json())
          .then(setTasks));
  }

  useEffect(() => {
    fetch("https://volga24bot.com/kartoteka/api/tech/CheckCard/getNotCorrectCard.php")
      .then(res => res.json())
      .then(setTasks);
  }, [])

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}><h5 className={styles.heading}>Объекты без карточек - {tasks.length}</h5></div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>X</button>

          {
            tasks.map((el, i) =>
              <TaskItem key={el[0]} task={el} i={i} history={[]}>
                <button style={{ "margin": "8px" }} onClick={(e) => { e.stopPropagation(); applyCard(el[0]) }}>Подтвердить получение</button>
              </TaskItem>
            )
          }

        </div>
      </div>
    </>
  );
};