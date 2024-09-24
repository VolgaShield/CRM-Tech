import React, {useEffect, useRef, useState} from 'react';
import styles from './Search.module.scss'
import Close from '../../img/close.png'
import SearchImg from '../../img/search.png'
import {$searchInput, getReq, setSearch, setSearchInput, $reqStatus, $checkBox, setCheckBox} from "../../state/Search";
import {useStore} from "effector-react";
import Moment from "react-moment";

import {setScrollY} from "../../state/scrollY";
import SearchItemsWrapper from "./SearchItemsWrapper";
import {setShowTask} from "../../state/showTask";
import {$usersStatus} from "../../state/getUsers";
import {filterTaskCust} from "../../utils/filterTaskCust";
import {getLastName} from "../../utils/getLastName";
import TaskItem from "../TaskItem/TaskItem";


const Search = () => {
    const input = useStore($searchInput)
    const req = useStore($reqStatus)
    const checkBox = useStore($checkBox)
    const deps = useStore($usersStatus);

    const [isNew, setIsNew] = useState(true);
    const [isWorking, setIsWorking] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isTO, setIsTO] = useState(false);

    const [tasks, setTasks] = useState([]);

    /**
    * Возвращает массив всех заявок c 7 полями id, objectNumber, objectAddress...
    * Заявки все кроме 'Не выезжали', ТО все новые для истории
    */
    const fetchDataHistory = async () => {
      let a = null;
      let b = null;
      const url = `getTasksForHistory.php/?startDate=${a}&endDate=${b}`;
      const base = 'https://volga24bot.com/kartoteka/api/tech';

      const mass = await fetch(`${base}/${url}`).then(res => res.json());
      setTasks(mass);
    }

    useEffect(() => {
      fetchDataHistory();
    }, [])

    useEffect(() => {
        setScrollY(0)
    }, [])

    return (
       <div>
            <header className={styles.headerWrapper}>
                <div className={styles.searchHeader}>
                    <img src={SearchImg} alt="" className={styles.searchImg}/>
                    <input type="text" placeholder="Введите ключевое слово, минимум 3 символа" autoFocus={true} value={input} onChange={(e) => setSearchInput(e.target.value)}/>
                    <img src={Close} alt="" onClick={() => {
                        setSearchInput('')
                        setSearch(false)
                    }}/>
                </div>
                <div className={styles.legend}>
                    <label><input type="checkbox" checked={checkBox} onChange={(e) => setCheckBox(e.target.checked)} />Мои</label>

                    <div className={styles.legendWrapper}>
                        <div className={`${styles.circle2} ${styles.blue}`}></div>
                        <p><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} /> Новая <span>({req.filter(item => item[18] === 'Новая').length})</span></p>
                    </div>
                    <div className={styles.legendWrapper}>
                        <div className={`${styles.circle2} ${styles.orange}`}></div>
                        <p><input type="checkbox" checked={isWorking} onChange={(e) => setIsWorking(e.target.checked)} /> В работе <span>({req.filter(item => item[18] === 'В работе').length})</span></p>
                    </div>
                    <div className={styles.legendWrapper}>
                        <div className={`${styles.circle2} ${styles.green}`}></div>
                        <p><input type="checkbox" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} /> Выполнено <span>({req.filter(item => item[18] === 'Выполнена' || item[18] === 'Не выполнено' || item[18] === 'Выполнено частично' || item[18] === 'Выезд не требуется' || item[18] === 'Не выезжали').length})</span></p>
                    </div>
                    <div className={styles.legendWrapper}>
                        <p><input type="checkbox" checked={isTO} onChange={(e) => setIsTO(e.target.checked)} />Показать ТО</p>
                    </div>
                </div>
            </header>

            <SearchItemsWrapper  >
                {req
                .filter(item => !isTO ? item[8] !== 'ТО' : item[8] === 'ТО')
                .filter(item => item[18] !== 'Брак')
                .filter(item => !isCompleted ? item[18] !== 'Выполнена' && item[18] !== 'Не выполнено' && item[18] !== 'Выполнено частично' && item[18] !== 'Выезд не требуется' && item[18] !== 'Не выезжали' : item)
                .filter(item => !isNew ? item[18] !== 'Новая' : item)
                .filter(item => !isWorking ? item[18] !== 'В работе' : item)
                .splice(0, 40)
                .map((el, i) => {
                    return <TaskItem task={el} key={el[0]} i={i} history={tasks}/>
                })}
            </SearchItemsWrapper>
            </div>
    );
}



export default Search;
