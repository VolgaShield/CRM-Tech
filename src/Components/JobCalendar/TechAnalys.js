import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import moment from 'moment';

import { $firstTime, $secondTime } from "../../state/techTime";
import { $planStatus } from "../../state/plan";

import styles from './JobCalendar.module.scss';

const TechAnalys = ({ tech = [0, '', 0, 0], tasks, plan, planTasks, surname }) => {
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);
    const planTask = useStore($planStatus);

    const [coef, setCoef] = useState(0); // Фактический коэффициент
    const [planCoef, setPlanCoef] = useState(0); // Планируемый коэффициент
    const [lateCoef, setLateCoef] = useState(0); // Просроченный коэффициент
    const [coefColor, setCoefColor] = useState('green');

    const getCoef = (tasks) => {
        let coef;
        let seconds = 0;

        tasks.forEach(task => {
            if (task[8] !== "Повтор" && task[18] !== "Брак") {
                if (task[55].split(' ')[0] === surname) {
                    // task[55] - ФИО техника
                    // task[59] - время, назначенное на задачу
                    seconds += task[59] * 60 * 60;
                }
            }
        })

        coef = seconds * 100 / 28800;
        return coef.toFixed(0);
    };

    useEffect(() => {
        let coef;
        let seconds = 0;

        if (plan) {
            planTasks.forEach(task => {
                seconds += task[59] * 60 * 60;
            })
        } else {
            tasks.forEach(task => {
                if (task[3] !== 'Повтор') {
                    const users = task[7]
                        .split(',')
                        .filter(task => task.indexOf('Фатиги') === -1 && task.indexOf('Баткаев') === -1 && task.indexOf('Петров') === -1);
                    // Часы, минуты и секунды с начала работы до завершения (в секундах)
                    const htos = +task[9].slice(0, 2) * 60 * 60;
                    const mtos = +task[9].slice(3, 5) * 60;
                    const csec = +task[9].slice(6, 8);
                    const diffTime = htos + mtos + csec;

                    if (task[18] === 'В работе') {
                        let a = moment(task[5]);
                        let b = moment(new Date());
                        seconds += b.diff(a, 'seconds');
                        setCoefColor('orange');
                    }

                    if (task[8] === 'Монтаж' || task[8] === 'Демонтаж') {
                        if ((task[18] !== 'В работе' || task[18] !== 'Выезд не требуется' || task[18] !== 'Не выезжали')
                            && diffTime > 300 && task[34] > 0) {
                            if (diffTime > (task[34] * 60 * 60) / users.length) {
                                seconds += (task[34] * 60 * 60) / users.length;
                            } else {
                                seconds += diffTime;
                            }
                        }
                    } else {
                        if ((task[18] !== 'В работе' || task[18] !== 'Выезд не требуется' || task[18] !== 'Не выезжали')
                            && diffTime > 300 && task[34] > 0) {
                            seconds += (task[34] * 60 * 60) / users.length;
                        }
                    }
                }
            })
        };

        coef = seconds * 100 / 28800;

        if (coefColor !== 'orange') {
            if (coef < 80) {
                setCoefColor('red')
            } else {
                setCoefColor('green')
            }
        };

        if (coef === 0) {
            setCoef(0)
        } else if (coef < 1) {
            setCoef(coef.toFixed(2))
        } else {
            setCoef(coef.toFixed(0))
        };

        const yesterday = (Date.now() - 60 * 60 * 24 * 1000); // el[17] - create time    el[18] typeResult

        setPlanCoef(getCoef(planTask.CURRENT.filter(task => Date.parse((task[56] + " " + task[57]).replace(' ', 'T')) >= yesterday)));

        setLateCoef(getCoef(planTask.CURRENT.filter(task => Date.parse((task[56] + " " + task[57]).replace(' ', 'T')) < yesterday)));
    }, [tasks, firstTime, secondTime, planTask]);

    return (
        <div className={styles.mainInfo}>
            <p>
                Задачи:
                {tasks.length + planTask.CURRENT.filter(task => task[18] !== "Брак" && task[55].split(' ')[0] === surname).length}
            </p>
            <strong>КПД:</strong>
            <p>План: <span style={{ color: 'blue' }}>{planCoef}%</span></p>
            <p>
                Факт:
                <span style={{ color: tasks.filter(task => task[18] === 'В работе').length ? 'orange' : coefColor }}>  {coef}%</span>
            </p>
            <p>Просроч: <span style={{ color: 'red' }}>{lateCoef}%</span></p>
        </div>
    );
};

export default TechAnalys;
