import styles from "../JobCalendar.module.scss";
import TechAnalys from "../TechAnalys";
import React, { useEffect, useRef, useState } from "react";
import { TimeLineItem } from "./TimeLineItem";
import { useStore } from "effector-react";
import { $firstTime } from "../../../state/graphTime";
import moment from 'moment'

const NotCheckLine = ({ status, tech, type }) => {
    return (
        tech !== 'Войцеховский' ? <div className={styles.notInJob}>
            <p>{status}</p>
        </div> : null

    )
};

const StatusLine = ({ status, tech }) => {
    return (
        tech !== 'Войцеховский' ? <div className={styles.not_checked}>

        </div> : null

    )
};

function getDateOnMS(date) {
    return new Date(`${date}T00:00:00`).getTime()
}

export const TimeLine = ({ tasks, title, info, status, plane }) => {

    const title2 = title.split(' ');
    const firstTime = useStore($firstTime);
    const [planeT, setPlane] = useState([])
    const [trip, setTrip] = useState([])
    const filtredTasks = tasks.filter(el => {           // Фильтрация, если заявка находится в работе, в пути или diffTime больше 5 мин
        const htos = el[9].substr(0, 2) * 60 * 60;     // оно включается в масив filtredTasks
        const mtos = el[9].substr(3, 2) * 60;
        const csec = +el[9].substr(6, 2)

        const diffTime = htos + mtos + csec;

        if (diffTime > 300 || el[18] === 'В работе' || el[18] === 'В пути') {
            return true
        }
    })

    const date = new Date().getHours();
    useEffect(() => {
        fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getPlane.php?tech=${title2[0]}&date=${moment(firstTime).format('YYYY-MM-DD')}`)
            .then(res => res.json())
            .then(tasks => {

                if (tasks) {
                    //if (getDateOnMS(moment(firstTime).format('YYYY-MM-DD')) > getDateOnMS(moment(new Date()).format('YYYY-MM-DD'))) {
                    //  setPlane(tasks.filter(el => moment(`${el[56]} ${el[57]}`).valueOf() > getDateOnMS(moment(firstTime).format('YYYY-MM-DD'))))
                    //}
                    //else {
                    setPlane(tasks)
                    //}
                }
            })
            .catch(function (res) { console.log(res) })

        // fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getTrip.php?tech=${title2[0]}&date=${moment(firstTime).format('YYYY-MM-DD')}`)
        //     .then(res => res.json())
        //     .then(tasks => {

        //         if (tasks) {
        //             setTrip(tasks)
        //           }
        //     })
        //     .catch(function(res){ console.log(res) })

    }, [plane, firstTime])


    //Функция принимает две даты и проверяет, существуют ли они в один и тот же день
    const areDatesOnSameDay = (first, second) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();


    const widthCalc = (tasks, plane) => {
        let gLength = 0;
        let gLength2 = 0;
        if (tasks.length) {
            const lastTask = tasks[tasks.length - 1]
            if (lastTask[18] === 'В работе') {
                let date = moment().format('HH')
                return (+date + 1 - 8) * 60 * 0.5
            } else {
                let date = lastTask[6].substr(11, 2)

                gLength = (+date + 1 - 8) * 60 * 0.5
            }


        } else {
            gLength = 0
        }

        if (plane.length) {
            const lastTask = plane[plane.length - 1]
            let date = +lastTask[57].substr(0, 2) + +lastTask[59]

            gLength2 = (+date + 1 - 8) * 60 * 0.5
        } else {
            gLength2 = 0;
        }


        if (gLength > gLength2) {
            return gLength
        } else {
            return gLength2
        }

    }

    //console.log(info)

    return (
        <div className={`${styles.timeLineWrapper} ${status === 'Дежурный' ? styles.dezh : null} ${trip.length ? styles.trip : null}`}>

            {/* Информация о технике, его КПД и количестве задач. При нажатии выбирается данный техник */}
            <div className={styles.titleWrapper}>
                <p className={styles.title}>{title2[0]}</p>
                {status === 'Дежурный' ? <p style={{ color: 'green', fontSize: 13, marginLeft: 10 }}>Дежурный</p> : null}
                {/* {trip.length ? <p style={{color: 'blue', fontSize: 13, marginLeft: 10}}>Командировка</p> : null} */}
                <TechAnalys tasks={tasks} tech={info[0]} plane={plane} planeTasks={planeT} fio={title} />
            </div>

            <div style={{ overflowX: 'auto', overflowY: 'hidden', height: 70, paddingTop: 3, paddingBottom: 8 }}>
                <div className={styles.timeLine} style={{ width: widthCalc(filtredTasks, planeT), minWidth: 12 * 60 * 0.5 }} >
                    {<>
                        <span className={styles.label3}>12:00</span>
                        {<>

                            {/* Выполненные,  */}
                            {info.length ?
                                filtredTasks.length || date < 10
                                    ? <>
                                        {filtredTasks.map((el, i) => <TimeLineItem
                                            i={i}
                                            lastI={filtredTasks.length - 1}
                                            task={el}
                                            key={el[0]}
                                            type={el[18]}
                                            timeStart={el[5].substr(11, 5)}
                                            timeFinish={el[6].substr(11, 5)}
                                            diffTime={el[9]} />)}

                                    </>
                                    : <StatusLine status={'Прогул'} tech={title2[0]} type={status} />
                                : status && status !== 'Дежурный'
                                    ? <NotCheckLine status={status} />
                                    : <StatusLine status={'Не заступил'} />
                            }

                            {planeT.filter(el => firstTime && (areDatesOnSameDay(firstTime, new Date(el[56])) || areDatesOnSameDay(firstTime, new Date(el[6]))))
                                .map((el, i) =>
                                    <TimeLineItem
                                        i={i}
                                        tasksLength={filtredTasks.length}
                                        task={el}
                                        key={el[0]}
                                        type={el[18]}
                                        timeStart={`${el[57]}`}
                                        timeFinish={moment(new Date(`${el[56]} ${el[57]}`)).add(el[59] * 60, 'minutes').format('HH:mm:ss')}
                                        diffTime={el[9]}
                                        typeLine={'plane'}
                                        lastitem={planeT}
                                    />)}



                            {info.length && info[0][3] && info[0][3].indexOf(title) === -1
                                ? <span className={styles.helper}>{info[0][3].split(' ')[0].toUpperCase()}</span>
                                : null}
                        </>}
                    </>}
                </div>
            </div>

            {info[4] === '1' ? <div className={styles.trip}><p>Командировка</p></div> : null}
        </div>
    )
}