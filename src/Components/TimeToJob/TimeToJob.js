import React, {useEffect, useState} from 'react';
import moment from 'moment';
import styles from './TimeToJob.module.scss'




const TimeToJob = ({time, deadline, numTech}) => {

    const [color, setColor] = useState('green');

    const [diffTime, setDiffTime] = useState('');

        const getTime = () => {
            let date = new Date();
            let newDate = moment({
                h: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            })
            let startDate = moment({
                h: time.substr(11,2),
                m: time.substr(14,2),
                s: time.substr(17,2)
            })

            const seconds = newDate.diff(startDate, "seconds")
            let resultDate = moment("1900-01-01 00:00:00").add(seconds, 'seconds').format("HH:mm:ss");

            let h = +resultDate.substr(0,2);
            let m = +resultDate.substr(3,2);
            let s = +resultDate.substr(6,2);
            const seconds2 =(h*60 +m ) *60 + s;
            let newSeconds = (deadline * 60) * 60 / numTech;

            if (seconds2 >= newSeconds) {
                setColor("red");
            }

            setDiffTime(resultDate);

        }

        useEffect(() => {
            let interval = setInterval(() => {
                getTime()
            }, 1000);

            return () => {
                clearInterval(interval)
            }

        }, [])
    return (
        <>
            {color === 'red' ? <div className={styles.codRed}><p>ПРОСРОЧЕНО</p></div> : null}
            <p>
                Текущее время работы: <span style={{color: color}}>{diffTime}</span>

            </p>
        </>

    );
}



export default TimeToJob;
