import React, {useEffect, useState, useMemo} from 'react';
import styles from './TaskItem.module.scss';
import {useStore} from "effector-react";
import Brak from '../../img/closered.png'
import {$usersStatus} from "../../state/getUsers";
import {filterTaskCust} from "../../utils/filterTaskCust";
import {getLastName} from "../../utils/getLastName";
import {setScrollY} from "../../state/scrollY";
import {setShowTask} from "../../state/showTask";
import moment from "moment";
import {getHistoryType} from "../../utils/history_type";
import {$firstTime} from "../../state/graphTime";
import { useCallback } from 'react';

/**
 * @param {object} param0
 * @returns jsx отдельной заявки
 */
const TaskItem = ({task, i, func, history, children}) => {
    const deps = useStore($usersStatus);
    const firstTime = useStore($firstTime);
    const [hLength, sethLength] = useState(0);

    let json_history;

    try {
      let hson = task[52] ? JSON.parse(task[52]) : []
      json_history = hson.length ? hson.flat(1) : []
    } catch (err) {
      // 👇️ SyntaxError: Unexpected end of JSON input
      console.log(err)
    }

    /**
     * Хук для подчета длины массива всех заявок на объект
     */
    useEffect(() => {
      let l = task[1] !== '0'
      ? history.filter(el => el[1] === task[1] || el[4] === task[4]).length
      : history.filter(el => el[4] === task[4]).length;
      sethLength(l);
    }, [task, history])

    /**
     * Количество просроченных дней
     */
    const daysOverdue = useMemo(() => {
      const taskDate = Date.parse(task[17].replace(' ', 'T'));
      return Math.ceil(Math.abs(firstTime.getTime() - taskDate) / (1000 * 3600 * 24)) - 1;
    }, [task, firstTime])

    /**
     * Высчитывает просрочена ли запланированная задача
     */
    const isPast = useCallback((task) => {
      const taskDate =  Date.parse((task[56] + " " + task[57]).replace(' ', 'T'));
      //const taskDate = Date.parse(task[17].replace(' ', 'T'));
      return firstTime.setHours(0, 0, 0, 0) > taskDate;
    }, [firstTime])


    return (
        <li key={task[0]} onClick={() => {
            setScrollY(window.scrollY)
            setShowTask(task)
        }} className={styles.wrapper}>
            <div className={styles.statusWrapper}> {/*Обозначения перед заявкой: номер, кружок, кол-во всего заявок*/}
					    <strong>{i+1}</strong>
                {task[18] === 'Брак' ? <div><img style={{width: 20, height: 20}} src={Brak} alt=""/></div> : null}
                {task[18] === 'Новая' ?
                  isPast(task)
                  ? <div  className={`${styles.circle} ${styles.transparentRed}`}></div>
                  : <div  className={`${styles.circle} ${styles.blue}`}></div>
                  : null}
                {task[18] === 'В пути' ? <div  className={`${styles.circle} ${styles.orange}`}></div> : null}
                {task[18] === 'В работе' ? <div  className={`${styles.circle} ${styles.yellow}`}></div> : null}
                {task[18] !== 'В работе' && task[18] !== 'Новая' && task[18] !== 'В пути' && task[18] !== 'Брак'  ? <div  className={`${styles.circle} ${styles.green}`}></div> : null}
                <strong style={{color: 'teal'}}>{hLength}</strong>
                <p style={{marginTop: '26px'}}>{daysOverdue}</p>
            </div>
            <div style={{width: "80%"}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><p style={{fontWeight: 500}}>{task[8]} </p><p style={{fontWeight: 500}}>{task[47]}</p></div>
                <p style={{fontWeight: 400, fontSize: 14}}>{task[2]}</p>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p style={{fontWeight: 400, fontSize: 14}}>{task[4]}</p>
                  <p>создание:</p>
                </div>
                {/* <p style={{color: 'red'}}>{task[13]}</p> описание проблемы */}
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {task[38] ?
                  <p>Постановщик:<span style={{fontWeight: 500}}> {task[38]}</span > </p>
                  : <p>Постановщик:<span style={{fontWeight: 500}}> Битрикс</span ></p>}
                  <p>{moment(task[17]).format('DD.MM HH:mm')}</p>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>
                    <span style={{fontWeight: 500}}>
                      Ответственный:
                    </span> 
                      {deps.find(el2 => +el2.DEP === filterTaskCust(task[4]))?.CHIEF.LAST_NAME}
                  </p>
                  <p> {/*Отображение числа отправки в брак*/}
                    {json_history.filter(j => j.type === 'deffect').length > 0
                     ? 'брак: ' + moment(json_history.filter(j => j.type === 'deffect')[0].date)
                     .format('DD.MM HH:mm') : null}
                  </p>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {<p><span style={{fontWeight: 500}}>Исполнитель:</span> {task[7].length ? getLastName(task[7]) : task[55].length ? getLastName(task[55]) : 'Не назначен'} </p>}
                <p>{task[65] ? 'поехал: ' + moment(task[65]).format('DD.MM HH:mm') : null}</p>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p>{json_history?.length ? <p style={{color: 'blue', fontWeight: 500}}> {getHistoryType(json_history[json_history.length - 1])} </p>: <p style={{color: 'red', fontWeight: 500}}>Не прочитана</p>}</p>
                <p>{task[5] ? 'начало: ' + moment(task[5]).format('DD.MM HH:mm') : null}</p>
                </div>

                <div><p style={{color: 'green', fontWeight: 500}}>{task[64]}</p></div>
                {/*{task[18] === 'Новая' || task[18] === 'В работе' ? <p className={styles.date}><Moment format="DD.MM.YYYY  HH:mm">{task[17]}</Moment></p> : <p className={styles.date}><Moment format="DD.MM.YYYY hh:mm">{task[6]}</Moment></p>}*/}

                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>
                    <p className={styles.date} style={{fontWeight: 800}}>Работа: {task[34]} ч/ч</p>
                    {/* <p className={styles.date}>Время: <b>{task[58] === 'to' ? 'до' : null} {task[58] === 'from' ? 'после' : null} {task[57] === '07:00' || !task[57].length ? 'Нет' : moment(`${task[56]} ${task[57]}`).format('HH:mm')}</b></p> */}
                    </div>
                    <p>{task[6] ? 'конец: ' +moment(task[6]).format('DD.MM HH:mm') : null}</p>
                </div>
            </div>
            {children}
        </li>
    );
}



export default TaskItem;
