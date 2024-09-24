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

export const TimeLineCommon = ({ tasks, graph }) => {

    const firstTime = useStore($firstTime);
    const [planeT, setPlane] = useState([])

    const newTasks = tasks.filter(el => el[55] === '')?.filter(el =>
        firstTime.setHours(0, 0, 0) < Date.parse((el[56] + " " + el[57]).replace(' ', 'T'))
        && Date.parse((el[56] + " " + el[57]).replace(' ', 'T')) < firstTime.setHours(23, 59, 59)
    ).sort((a, b) => Date.parse((a[56] + " " + a[57]).replace(' ', 'T')) > Date.parse((b[56] + " " + b[57]).replace(' ', 'T')));

    const completedTasks = graph.filter(el => el[18] !== 'В работе' && el[18] !== 'В пути');

    const notCompletedTasks = tasks.filter(el => el[55] === '');

    const filtredTasks = newTasks;
    // const filtredTasks = newTasks.filter(el => {
    //     const htos = el[9].substr(0, 2) * 60 * 60;
    //     const mtos = el[9].substr(3, 2) * 60;
    //     const csec = +el[9].substr(6, 2)

    //     const diffTime = htos + mtos + csec;

    //     if (diffTime > 300 || el[18] === 'В работе' || el[18] === 'В пути') {
    //         return true
    //     }
    // })

    const date = new Date().getHours();
    // useEffect(() => {
    //     // fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getPlane.php?tech=${title2[0]}&date=${moment(firstTime).format('YYYY-MM-DD')}`)
    //     //     .then(res => res.json())
    //     //     .then(tasks => {

    //     //         if (tasks) {
    //     //             //if (getDateOnMS(moment(firstTime).format('YYYY-MM-DD')) > getDateOnMS(moment(new Date()).format('YYYY-MM-DD'))) {
    //     //             //  setPlane(tasks.filter(el => moment(`${el[56]} ${el[57]}`).valueOf() > getDateOnMS(moment(firstTime).format('YYYY-MM-DD'))))
    //     //             //}
    //     //             //else {
    //     //             setPlane(tasks)
    //     //             //}
    //     //         }
    //     //     })
    //     //     .catch(function (res) { console.log(res) })

    //     // fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getTrip.php?tech=${title2[0]}&date=${moment(firstTime).format('YYYY-MM-DD')}`)
    //     //     .then(res => res.json())
    //     //     .then(tasks => {

    //     //         if (tasks) {
    //     //             setTrip(tasks)
    //     //           }
    //     //     })
    //     //     .catch(function(res){ console.log(res) })

    // }, [plane, firstTime])


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
        <div className={styles.timeLineWrapper}>

            {/* <button onClick={() => console.log(filtredTasks)}>2222</button> */}

            {/* Информация о технике, его КПД и количестве задач. При нажатии выбирается данный техник */}
            <div className={styles.titleWrapper}>
                <p className={styles.title} style={{ color: (newTasks?.length - completedTasks?.length > 0) ? 'red' : 'green' }}>Общие ({newTasks?.length - completedTasks?.length})</p>

                <div className={styles.mainInfo}  >
                    <p>Новые: <span style={{ color: 'blue' }}>{newTasks?.length}</span></p>
                    <p>Вып.: <span style={{ color: 'green' }}>{completedTasks?.length}</span></p>
                    <p>Невып.: <span style={{ color: 'red' }}>{notCompletedTasks.length}</span></p>
                </div>
                {/* <TechAnalys tasks={tasks} tech={info[0]} plane={plane} planeTasks={planeT} fio={title} /> */}
            </div>

            <div style={{ overflowX: 'auto', overflowY: 'hidden', height: 70, paddingTop: 3, paddingBottom: 8 }}>
                <div className={styles.timeLine} style={{ width: widthCalc(filtredTasks, planeT), minWidth: 12 * 60 * 0.5 }} >
                    {<>
                        <span className={styles.label3}>12:00</span>
                        {<>

                            {/* Выполненные,  */}
                            {/* {
                                <>
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
                            } */}

                            {newTasks
                                .map((el, i) =>
                                    <TimeLineItem
                                        i={i}
                                        tasksLength={0}
                                        task={el}
                                        key={el[0]}
                                        type={el[18]}
                                        timeStart={`${el[57]}`}
                                        timeFinish={moment(new Date(`${el[56]} ${el[57]}`)).add(el[59] * 60, 'minutes').format('HH:mm:ss')}
                                        diffTime={el[9]}
                                        typeLine={'new'}
                                        lastitem={planeT}
                                    />)}
                        </>}
                    </>}
                </div>
            </div>
        </div>
    )
}