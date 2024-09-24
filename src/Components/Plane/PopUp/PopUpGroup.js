import React, {useEffect, useState} from 'react';
import styles from './PopUp.module.scss'
import {useStore} from "effector-react";
import {$usersStatus} from "../../../state/getUsers";
import moment from 'moment'
import {$today} from "../../../state/tasks";
import {getAllReq, getNewReq} from "../../../state";
import Close from '../../../img/close.png'

const times = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
function declOfNum(n, text_forms) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}



const TechItem = ({item, func, func2,task, checked, techs, all, tasksToday, setCoef}) => {
    const [tasks, setTasks] = useState([]);
    const [htmlItem, setHtmlItem] = useState(<span>0</span>)
    useEffect(() => {
        fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getPlane.php?tech=${item[1]}`)
            .then(res => res.json())
            .then(tasks => {
                if (tasks) {
                    setTasks(tasks)
                    let seconds = 0;
                    tasks.forEach(el => {
                        const time = el[59] * 60 * 60
                        seconds+=time;
                    })
                    if (checked && !all) {

                        let deadline = task[34] / techs.length

                        if (deadline <= 9) {
                            seconds+=deadline*60*60
                        } else {
                            seconds+=9*60*60
                        }
                    } else if (checked && all) {
                        tasksToday.forEach(el => {
                            let deadline = el[34] / techs.length

                            if (deadline <= 9) {
                                seconds+=deadline*60*60
                            } else {
                                seconds+=9*60*60
                            }
                        })
                    }

                    let coef = seconds*100/28800;
                    setCoef(coef.toFixed(0), item[1])
                    if (coef.toFixed(0) >= 100) {
                        setHtmlItem(<span style={{color: 'red', fontWeight: 500}}>{coef.toFixed(0)}%</span>)
                    } else {
                        setHtmlItem(<span style={{color: 'green', fontWeight: 500}}>{coef.toFixed(0)}%</span>)
                    }

                }
            })
            .catch(function(res){ console.log(res) })
    }, [checked, all]);


    return (
        <div className={styles.techWrapper}>
            <label>
                <input type="checkbox" onChange={(e) => {
                    if (e.target.checked) {
                        func()
                    } else {
                        func2()
                    }
                }}/>
                {item[1]}
            </label>
            <div className={styles.flex}>
                <p>Задач:  <span>{tasks.length}</span></p>
                <p>КПД: {htmlItem}</p>
            </div>
        </div>
    )
}

const PopUp = ({item, time, close}) => {
    const users = useStore($usersStatus)
    const techs =  item[34] / 8 <= 1 ? 1 : item[34] / 8 > 2 ? 3 : 2;
    const today = useStore($today);

    const [coef, setCoef] = useState([]);

    const [form, setForm] = useState({
        datepicker: moment().format('YYYY-MM-DD'),
        typetime: 'without',
        time: '07:00',
        techs: [],
        all: false
    })

    const handleSubmit = (date, time, type, techs, all, id, coefs) => {
        if (techs.length) {
            const error = coefs.filter(el => el.coef >=100)

            if (error.length) {
                alert(`Невозможно назначить ${all ? 'Задачи' : 'Задачу'} так как у техника планируемое КПД выше 100%`)
            } else {
                let data = new FormData();
                let deadline = item[34] / techs.length

                data.append('date', date)
                data.append('time', time)
                data.append('deadline', deadline <= 9 ? deadline : 9)
                data.append('type', type)
                data.append('techs', techs.join(','))
                data.append('id', id)
                data.append('ids', all ? today.filter(el => el[8] === item[8] && el[3] === item[3]).map(el => el[0]) : '')

                fetch('https://volga24bot.com/kartoteka/api/tech/planing/setPlane.php',{
                    method: "POST",
                    body: data
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res === 'success') {
                            getAllReq();
                            close()
                        } else {
                            alert('Произошла ошибка')
                        }
                    })
                    .catch(function(res){ console.log(res) })
            }

        } else {
            alert('Выберите хотябы 1 техника!');
        }


    }

    return (
        <div className={styles.wrapper}>

            <div className={styles.popUpWrapper}>
                <div className={styles.closeWrapper} onClick={(e) => {
                    e.stopPropagation()
                    close(false)
                }}><img src={Close} alt="" /></div>
                <div className={styles.block}>
                    <p className={styles.title}>Информация</p>
                    <p className={`${styles.red}`}>{item[3] ? item[3] : item[8]}</p>
                    <p>{item[2]}</p>
                    <p>{item[4]}</p>
                </div>
                <div className={styles.block}>
                    <p className={styles.title}>Рекомендации</p>
                    <p>Время на работу: <b>{item[34] === '0' ? 'Время отсутствует!' : time}</b></p>
                    <p>Рекомендуемое число техников: <b>{item[34] === '0' ? 'Неизвестно!' : techs}</b></p>
                </div>

                <div className={`${styles.block} ${styles.flex}`}>
                    <div>
                        <p className={styles.title}>Дата</p>
                        <label>
                            <input type="date" value={form.datepicker} onChange={(e) => setForm(({...form, datepicker: e.target.value}))} className={styles.input}/>

                        </label>
                    </div>
                    <div>
                        <p className={styles.title}>Время</p>
                        <label>
                            <select name="typepeacker" className={styles.input} value={form.typetime} onChange={(e) => {

                                if (e.target.value === 'fixed') {

                                    setForm(({...form, typetime: e.target.value, all: false}))
                                } else {
                                    setForm(({...form, typetime: e.target.value}))
                                }

                            }}>
                                <option value="without">Без времени</option>
                                <option value="from">С</option>
                                <option value="to">До</option>
                                <option value="fixed">Фикс.</option>
                            </select>

                        </label>
                        {form.typetime !== 'without' ? <label>
                            <select name="timepeacker" className={styles.input} value={form.time} onChange={(e) => setForm(({...form, time: e.target.value}))}>
                                {times.map(el => <option value={el} key={el}>{el}</option>)}
                            </select>

                        </label> : null}
                    </div>


                </div>
                <div className={styles.block}>
                    <p className={styles.title}>Техники</p>
                    {users.filter(el => (el[5] !== 'Водитель' && el[5] !== 'Начальник') && el[1] !== 'Страхов Евгений Александрович').map(el =>
                        <TechItem
                            item={el}
                            key={el[1]}
                            func={() => setForm(({...form, techs: [...form.techs, el[1]]}))}
                            func2={() => setForm(({...form, techs: form.techs.filter(el2 => el2 !== el[1])}))}
                            task={item}
                            checked={form.techs.filter(el2 => el2 === el[1]).length}
                            techs={form.techs}
                            all={form.all}
                            tasksToday={today.filter(el => el[8] === item[8] && el[3] === item[3])}
                            setCoef={(c, name) => setCoef(prevState => {
                                const newArr = prevState.filter(names => names.name !== name)
                                return [...newArr, {name: name, coef: c}]
                            })}

                        />)}
                    {form.techs.length && item[34] !== '0' ? <p style={{marginTop: 10}}>Задача выполнится в течении: <span style={{fontWeight: 500}}>{Math.ceil(item[34] / (8 * form.techs.length))} {declOfNum(Math.ceil(item[34] / (8 * form.techs.length)), ['дня', 'дней', 'дней'])}</span></p> : null}
                </div>

                <div className={styles.btn}>
                    <button onClick={() => handleSubmit(form.datepicker, form.time, form.typetime, form.techs, form.all, item[0], coef)}>
                        Назначить
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PopUp;
