import React, {useEffect, useState} from 'react';
import styles from './TechItem.module.scss'
import Drop from '../../img/dropdown.png'
import Up from '../../img/upMenu.png'
import TimeToJob from "../TimeToJob/TimeToJob";
import {useStore} from "effector-react";
import {$techsStatus} from "../../state/Techs";
import TechAnalys from "../TechAnalys/TechAnalys";


const TechItem = ({tech,tasks,job,comp}) => {
    const techs = useStore($techsStatus);


    const [current, setCurrent] = useState(true)
    const [completed, setCompleted] = useState(false)
    const [total, setTotal] = useState(false)
    const title = tech[1].split(' ');

    const imagesTechs = (tehs) => {

        let cust = tehs.split(',');
        let people = cust.length;
        let imgs = [];

        for (let i = 0; i < people; i++) {

            const item = techs.filter(el => el[1] === cust[i] );

            imgs.push(item[0])
        }

        return imgs

    }

    const timeForJob = (peopleList, deadline) => {

        peopleList = peopleList.filter(el => el !== undefined)

        let newPeople = peopleList.filter(el => el[0] !== "Фатиги Ильяс Исмаил");

        let time;

        if (deadline < 1) {
            time = `${(deadline * 60) / newPeople.length} м`
        } else {
            time = `${deadline / newPeople.length} ч`
        }

        return {time, newPeople}
    }

    const jobComponent = (info, i) => {
            const imgs = imagesTechs(info[7]);
            const {time, newPeople} = timeForJob(imgs, info[34])
            return (
                <div  className={styles.inJob} key={info[0]}>

                    <div className={styles.num}>{i+1}</div>
                    <div className={styles.textBlock}>
                        {info[8] === 'Задача' ? <p>{info[13]}</p> :<p>{info[8] === 'Заявка' ? 'Заявка' : ''}{info[8] === 'ТО' ? 'ТО' : ''}{info[8] === 'Претензия' ? 'Претензия' : ''}{info[8] === 'Монтаж' ? 'Монтаж' : ''}{info[8] === 'Демонтаж' ? 'Демонтаж' : ''}{info[8] === 'СО' ? 'Снятие объемов' : ''} на объекте <span>{info[2]}</span> по адресу <span>{info[4].split('|')[0]}</span></p>
                        }
                        <div className={styles.infoAboutJob}>
                            <p className={styles.time}>Время на выполение: <span>{time}</span></p>
                            <p>Начал работу: <span>{info[5].substr(10, 9)}</span></p>
                            <TimeToJob time={info[5]} deadline={info[34]} numTech={newPeople.length}/>
                            <p className={styles.peopleInJob}>{imgs.length === 1 ? 'Выполняет' : 'Выполняет'} {imgs.length} {imgs.length === 1 ? 'Человек' : 'Человека'}</p>

                            <div className={styles.peopleInJobImages}>
                                {imgs.map(el => {
                                    if (el !== undefined) {
                                        return(<div key={el.title} className={styles.techPhoto}
                                                    style={{backgroundImage: `url(${el[5]})`}}>
                                        </div>)
                                    }
                                })}
                            </div>

                        </div>

                    </div>
                </div>
            )
    }

    const finishComponent = (info, i) => {
        let color;
        let comment;
        let deadline;
        if (info[8] === 'Заявка') {
            deadline = 1;
            if (info[12].length) {
                comment = info[12];
            } else {
                comment = info[15];
            }
        } else if (info[8] === 'СО') {
            deadline = 0.5
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Комментарий не оставили!';
            }
        } else if (info[8] === 'Демонтаж') {
            deadline = 0.5
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Комментарий не оставили!';
            }
        } else if (info[8] === 'Монтаж') {
            deadline = info[34]
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Комментарий не оставили!';
            }
        }else if (info[8] === 'ТО') {
            deadline = 0.5
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Комментарий не оставили!';
            }
        } else if (info[8] === 'Претензия') {
            deadline = 1
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Комментарий не оставили!';
            }
        } else if (info[8] === 'Задача') {
            deadline = info[34]
            if (info[15].length) {
                comment = info[15];
            } else {
                comment = 'Завершено';
            }
        }


        let h = +info[9].substr(0,2);
        let m = +info[9].substr(3,2);
        let s = +info[9].substr(6,2);
        const seconds =(h*60 +m ) *60 + s;
        const imgs = imagesTechs(info[7]);

        const {time, newPeople} = timeForJob(imgs, deadline);

        if (info[8] === 'Заявка') {
            let newSeconds = (60*60) / newPeople;

            if (seconds >= newSeconds) {
                color = "red"
            } else {
                color = "green"
            }
        } else if (info[8] === 'СО') {
            let newSeconds = ((60*60) /2 ) / newPeople;
            if (seconds >= newSeconds) {
                color = "red"
            } else {
                color = "green"
            }
        } else if (info[8] === 'Демонтаж') {
            let newSeconds = ((60*60) /2 ) / newPeople;
            if (seconds >= newSeconds) {
                color = "red"
            } else {
                color = "green"
            }
        } else if (info[8] === 'Монтаж') {
            let newSeconds = ((info[34]*60*60)) / newPeople;

            if (seconds >= newSeconds) {
                color = "red"
            } else {
                color = "green"
            }
        }

        return (
            <div  className={styles.inJob} key={info[0]}>
                <div className={styles.num}>{i+1}</div>
                <div>
                    {info[8] === 'Задача' ? <p>{info[13]}</p> :<p>{info[8] === 'Заявка' ? 'Заявка' : ''}{info[8] === 'ТО' ? 'ТО' : ''}{info[8] === 'Претензия' ? 'Претензия' : ''}{info[8] === 'Монтаж' ? 'Монтаж' : ''}{info[8] === 'Демонтаж' ? 'Демонтаж' : ''}{info[8] === 'СО' ? 'Снятие объемов' : ''} на объекте <span>{info[2]}</span> по адресу <span>{info[4].split('|')[0]}</span></p>
                    }
                    <p style={{color: "green"}} className={styles.typeResult}> {info[18]}</p>
                    <div className={styles.infoAboutJob}>
                        <p>Время на выполение: <span>{time}</span></p>
                        <p>Начал: <span>{info[5].substr(10, 9)}</span></p>
                        <p>Закончил : <span>{info[6].substr(10, 9)}</span></p>
                        <p>Выполнял <span style={{color: color}}>{info[9]}</span></p>
                        <p>Коммент: <span>{comment}</span></p>
                        {info[18] !== 'Выезд не требуется' ?
                        <>
                            <p className={styles.peopleInJob}>{imgs.length === 1 ? 'Выполнял' : 'Выполняло'} {imgs.length} {imgs.length === 1 ? 'Человек' : 'Человека'}</p>
                            <div className={styles.peopleInJobImages}>
                                {imgs.map(el => {
                                    if (el !== undefined) {
                                        return(<div key={el.title} className={styles.techPhoto}
                                                    style={{backgroundImage: `url(${el[5]})`}}>
                                        </div>)
                                    }
                                })}
                            </div>
                        </> : null}

                    </div>

                </div>
            </div>
        )
    }

    const taskComponent = (info, i) => {

        let time;
        if (info[8] === 'Заявка') {
            time = 1;

        } else if (info[8] === 'СО') {
            time = 0.5

        } else if (info[8] === 'Демонтаж') {
            time = 0.5

        } else if (info[8] === 'Монтаж') {
            time = info[34]

        }

        if (time < 1) {
            time = `${(time * 60)} м`
        } else {
            time = `${time} ч`
        }

        return (
            <div  className={styles.inJob} key={info[0]}>
                <div className={styles.num}>{i+1}</div>
                <div>
                    <p>{info[8] === 'Заявка' ? 'Заявка' : ''}{info[8] === 'Монтаж' ? 'Монтаж' : ''}{info[8] === 'Демонтаж' ? 'Демонтаж' : ''}{info[8] === 'СО' ? 'Снятие объемов' : ''} на объекте <span>{info[2]}</span> по адресу <span>{info[4]}</span></p>

                    <div className={styles.infoAboutJob}>
                        <p>Время на выполение: <span>{time}</span></p>
                        <p>Дата постановки: <span>{info[17].substr(8,2)}.{info[17].substr(5,2)}.{info[17].substr(0,4)}</span></p>
                        <p>Время постановки: <span>{info[17].substr(10, 9)}</span></p>
                        <p>Проблема: <span>{info[13]}</span></p>

                    </div>

                </div>
            </div>
        )
    }

    const readyCheck = (techData) => {

        if (techData) {
            const date = new Date();
            const todayCheck = `${date.getMonth()+1 <= 9 ? "0"+ (date.getMonth()+1) : date.getMonth()+1}-${date.getDate() <= 9 ? "0"+ (date.getDate()) : date.getDate()}`;
            const newDate = techData[3];

            const lastCheck = newDate.substr(5,5);
            if (techData[6] === 'Y') {
                return 'На больничном'
            }
            if (todayCheck === lastCheck) {
                return 'Заступил на работу в '+newDate.substr(11,5)
            } else {
                return 'Не заступил на работу!'
            }
        }

    }
    return (

        <li className={styles.techItem}>
            <header>
                <div className={styles.techPhoto} style={{ backgroundImage: `url(${tech[5]})` }}>

                </div>
                <div className={styles.titles}>
                    <p>
                        {title[0]} {title[1][0]}.{title[2][0]}.
                    </p>
                    <p>
                        {tech[4]}
                    </p>
                    <p>
                        {tech[3] ? readyCheck(tech) : null}
                    </p>
                </div>
            </header>
            <div className={styles.geo}>
                <p>Последнее местоположение: </p>
                {tech.length && readyCheck(tech) !== 'Не заступил на работу!' &&  readyCheck(tech) !== 'На больничном'? <>                  <p className={styles.position}>{tech[1].length > 3 ? tech[1] : 'Не найдено!'}</p>
                    <p className={styles.position2}>{tech[2].length > 3 ? ` ${tech[2].substr(8,2)}.${tech[2].substr(5,2)}.${tech[2].substr(0,4)} ${tech[2].substr(10,6)}` : ''}</p>
                </> : <p className={styles.position}>Неизвестно</p>}
            </div>
            <TechAnalys tech={tech} tasks={comp}/>
            <div className={styles.infoBlocks}>
                <div className={styles.dropDownMenu} onClick={() => setCurrent(prevState => !prevState)}>
                    {current ? <img src={Up} alt=""/> : <img src={Drop} alt=""/>}<p>Текущие задачи - <span style={{color: "grey"}}>{job.length}</span></p>
                </div>

                {current ? <div className={`${styles.tasks} ${styles.currentTask}`}>
                    {job.length ? job.map((el, i) => jobComponent(el, i)) : <p>На данный момент не выполняет ни одной задачи</p>}
                </div> : null}
            </div>

            <div className={styles.infoBlocks}>
                <div className={styles.dropDownMenu} onClick={() => setCompleted(prevState => !prevState)}>
                    {completed ? <img src={Up} alt=""/> : <img src={Drop} alt=""/>}<p>Выполненные задачи - <span style={{color: "grey"}}>{comp.length}</span></p>
                </div>

                {completed ? <div className={`${styles.tasks} ${styles.currentTask}`}>
                    {comp.length ? comp.map((el, i) => finishComponent(el, i)) : <p>На данный момент не выполнил ни одной задачи</p>}
                </div> : null}
            </div>

        </li>
    );
}



export default TechItem;
