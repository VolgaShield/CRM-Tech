import React, {useEffect, useState} from 'react';
import styles from './TechAnalys.module.scss'
import moment from 'moment';
import {useStore} from "effector-react";
import {$firstTime, $secondTime} from "../../state/techTime";

const TechAnalys = ({tech, tasks}) => {
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);

    const [totalTime, setTotalTime] = useState(null);
    const [totalColor, setTotalColor] = useState('green');
    const [mergeTime, setMergeTime] = useState(null)
    const [coef, setCoef] = useState(0);
    const [coefColor, setCoefColor] = useState('green')
    const [showTasks, setShowTasks] = useState(false)

    useEffect(() => {
        let coeff;
        let seconds = 0;
        
        let first = moment({
            d: firstTime.getDate()
        })
        let second = moment({
            d: secondTime.getDate()
        })

        const timeJob = second.diff(first, "days") * 8 * 60 * 60;


        tasks.forEach(task => {
            const users = task[7].split(',').filter(task => task !== 'Фатиги Ильяс Исмаил');

            const timeDeadline = (task[34] * 60 * 60) / users.length;
            //console.log(timeDeadline)
            let h = +task[9].substr(0,2);
            let m = +task[9].substr(3,2);
            let s = +task[9].substr(6,2)
            let newseconds = (h*60*60) + (m*60) + s;

              if (newseconds > timeDeadline) {
                  seconds += timeDeadline
              } else {
                  seconds += newseconds
              }
        })

        let resultDate = moment("1900-01-01 00:00:00").add(seconds, 'seconds');

        coeff = seconds * 100 / timeJob;

        if (coeff < 80) {
            setCoefColor('red')
            setTotalColor('red')
        } else {
            setCoefColor('green')
            setTotalColor('green')
        }

        if (coeff === 0) {
            setCoef(0)
        }
        else if (coeff < 1) {
            setCoef(coeff.toFixed(2))
        } else {
            setCoef(coeff.toFixed(0))
        }

        let mergeDate = moment("1900-01-01 00:00:00").add(seconds/tasks.length, 'seconds').format("HH:mm:ss");

        setTotalTime(resultDate.format("HH:mm:ss"));
        setMergeTime(mergeDate);
    }, [tasks, firstTime, secondTime])

    const color = (time, deadline) => {
        let h = +time.substr(0,2);
        let m = +time.substr(3,2);
        let s = +time.substr(6,2);
        let newseconds = (h*60*60) + (m*60) + s;
        let deadlineSec = deadline * 60 * 60;
        if (newseconds < deadlineSec) {
            return "green"
        } else {
            return "red"
        }
    }

    return (
        <div className={styles.techItem} >
            <div className={styles.mainInfo} onClick={() => setShowTasks(prev => !prev)} >
                <div className={styles.timeAnalys} style={!showTasks ? { borderBottom: `none ` } : null}>
                    <p>Выполненно задач: {tasks.length}</p>
                    <p>Общее время: <span style={{ color: totalColor }}>{totalTime}</span></p>
                    <p>Cреднее время: <span style={{ color: `orange` }}>{mergeTime}</span></p>
                    <p>КПД: <span style={{ color: coefColor }}>1%</span></p>
                </div>
            </div>
        </div>
    );
}

export default TechAnalys;
