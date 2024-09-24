import React, {useCallback, useEffect, useState} from 'react';
import styles from './Plane.module.scss'
import { $allReqStatus, getAllReq } from "../../state";
import {useStore} from "effector-react";
import moment from "moment";
import Collapse from "./Collapse/Collapse";
import CollapseItem from "./Collapse/CollapseItem/CollapseItem";
import Search from "./Search/Search";
import {$today, setToday} from "../../state/tasks";
import {$selected, cleareSelected} from "../../state/longTouch";
import Close from '../../img/close.png'
import PopUp from "./PopUp/PopUp";
import Nav from '../Nav/Nav';

function getDays(date) {
    return new Date(`${date}T00:00:00`).getTime()
}

const Plane = () => {
    const tasks = useStore($allReqStatus)
    const today = useStore($today);
    const [future, setFuture] = useState([])
    const [past, setPast] = useState([])
    const [tomorow, setTomorow] = useState([])
    const [search, setSearch] = useState('')
    const selected = useStore($selected);
    const [show, setShow] = useState(false);

    useEffect(() => {
        let todayArr1 = []
        let todayArr2 = [];
        let futureArr = [];
        let pastArr = [];
        let tomorowArr = [];

        const today = moment().format('YYYY-MM-DD')

        const tomorow = moment(new Date(+new Date() + 86400000)).format('YYYY-MM-DD');

        tasks.forEach(el => {
            if (getDays(today) === getDays(el[17].substr(0, 10))) {
                todayArr1.push(el)
            } else if (getDays(today) === getDays(el[17].substr(0, 10))) {
                todayArr2.push(el)
            } else if (getDays(tomorow) === getDays(el[17].substr(0, 10))) {
                tomorowArr.push(el)
            } else if (getDays(today) > getDays(el[17].substr(0, 10))) {
                pastArr.push(el)
            } else if (getDays(today) < getDays(el[17].substr(0, 10))) {
                futureArr.push(el)
            }
        })

        setToday([...todayArr1, ...todayArr2])
        setTomorow(tomorowArr)
        setPast(pastArr)
        setFuture(futureArr)
    }, [tasks]);

    //При выборе вкладки "Планирование" обновляется массив tasks
    useEffect(() => {
        getAllReq();
    },[Nav])

    return (
        <div className={styles.wrapper}>
            {selected.length ?<div className={styles.header} onClick={() => cleareSelected()}><img src={Close} alt=""/></div> : null }
            <Search setValue={setSearch} value={search}/>
            <div className={styles.collapse_wrapper}>
                <Collapse defaultOpen={false} title={'Будущие'}>
                    {search.length ? future.filter(el =>
                        el[3].toLowerCase().indexOf(search.toLowerCase())  !== -1
                        || el[8].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[13].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[2].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[4].toLowerCase().indexOf(search.toLowerCase()) !== -1).map(el => <CollapseItem item={el} key={el[0]}/>) : future.map(el => <CollapseItem item={el} key={el[0]}/>)}
                </Collapse>
                <Collapse defaultOpen={false} title={'Завтра'}>
                    {search.length ? tomorow.filter(el =>
                        el[3].toLowerCase().indexOf(search.toLowerCase())  !== -1
                        || el[8].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[13].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[2].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[4].toLowerCase().indexOf(search.toLowerCase()) !== -1).map(el => <CollapseItem item={el} key={el[0]}/>) : tomorow.map(el => <CollapseItem item={el} key={el[0]}/>)}
                </Collapse>
                <Collapse defaultOpen={true} title={'Сегодня'}>
                    { search.length ? today.filter(el =>
                        el[3].toLowerCase().indexOf(search.toLowerCase())  !== -1
                            || el[8].toLowerCase().indexOf(search.toLowerCase()) !== -1
                            || el[13].toLowerCase().indexOf(search.toLowerCase()) !== -1
                            || el[2].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[4].toLowerCase().indexOf(search.toLowerCase()) !== -1).map(el => <CollapseItem item={el} key={el[0]}/>) : today.map(el => <CollapseItem item={el} key={el[0]}/>)}
                </Collapse>
                <Collapse defaultOpen={false} title={'Просрочено'}>
                    {search.length ? past.filter(el =>
                        el[3].toLowerCase().indexOf(search.toLowerCase())  !== -1
                        || el[8].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[13].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[2].toLowerCase().indexOf(search.toLowerCase()) !== -1
                        || el[4].toLowerCase().indexOf(search.toLowerCase()) !== -1).map(el => <CollapseItem item={el} key={el[0]}/>) : past.map(el => <CollapseItem item={el} key={el[0]} />)}
                </Collapse>
            </div>
            {/*{selected.length ? <div className={styles.fixed} onClick={() => setShow(true)}>Назначить</div> : null}*/}
            {show ? <PopUp close={(a) => setShow(a)}/> : null}
        </div>
    );
};

export default Plane;
