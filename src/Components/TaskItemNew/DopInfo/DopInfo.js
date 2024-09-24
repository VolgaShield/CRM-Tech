import React, {useEffect, useState} from 'react';
import styles from './DopInfo.module.scss'


import {$status, getData} from "../../../state/andromeda";
import {useStore} from "effector-react";

import Moment from "react-moment";

const DopInfo = ({num}) => {
    const data = useStore($status);

    const [defaultEv, setDefaultEv] = useState(50);
    const [ev, setEv] = useState(null)

    useEffect(() => {
        getData(num);
        if (data['ev'].length) {
            setEv(data['ev'].slice(0,defaultEv));
        }
    }, [num])

    let block;
    if (data['ID'] >= 1 && data['ID'] <= 2999) {
        block = 'Неман';
    } else if (data['ID'] >= 3000 && data['ID'] <= 4999) {
        block = 'С-Nord';
    } else if (data['ID'] >= 5000 && data['ID'] <= 7999) {
        block = 'Ajax';
    } else if (data['ID'] >= 8000 && data['ID'] <= 9999) {
        block = 'Струна';
    } else if (data['ID'] >= 60000 && data['ID'] <= 70000) {
        block = 'Блиц';
    } else if (data['ID'] >= 300000 && data['ID'] <= 350000) {
        block = 'Ларс';
    }

    //console.log(ev)
    return (
        <div className={styles.dopInfo}>

            <div className={styles.infoWrapper}>
                <div>
                    <p className={styles.title}>Основная информация: </p>
                       <p><span>Номер:</span> {num}</p>
                       <p><span>Блок:</span> {block}</p>
                </div>
                {data['Customers'].length ? <div>
                    <p className={styles.title}>Хоз-органы: </p>
                    {data['Customers'].map((e, i) => <><p key={i}><span>{i+1}. {e['ObjCustName']}</span></p><p style={{marginLeft: 20}}> <a href={`tel:${e['ObjCustPhone1']}`}>{e['ObjCustPhone1']}</a></p></>)}
                </div> : null}
                {data['Zones'].length ? <div>
                    <p className={styles.title}>Шлейфы: </p>
                    {data['Zones'].map((e, i) => <><p key={i}><span>{e['ZoneNumber']}. </span>{e['ZoneDesc']}</p></>)}
                </div> : null}
                {data?.sim?.length ? <div>
                    <p className={styles.title}>Доп информация: </p>
                    {data.sim.map((e, i) => <><p key={i}><span>{e['ExtFieldName'].replace('Сим-карта', '')}. </span>{e['ExtFieldValue']}</p></>)}
                </div> : null}
                {ev ? <div>
                    <p className={styles.title}>События: </p>
                    <ul className={styles.events_counter}>

                        <li className={defaultEv === 50 ? 'active' : null} onClick={() => {
                            setDefaultEv(50)
                            setEv(data['ev'].slice(0,50))
                        }}>50</li>
                        <li className={defaultEv === 100 ? 'active' : null} onClick={() => {
                            setDefaultEv(100)
                            setEv(data['ev'].slice(0,100))
                        }}>100</li>
                        <li className={defaultEv === 300 ? 'active' : null} onClick={() => {
                            setDefaultEv(300)
                            setEv(data['ev'].slice(0,300))
                        }}>300</li>
                        <li className={defaultEv === 500 ? 'active' : null} onClick={() => {
                            setDefaultEv(500)
                            setEv(data['ev'].slice(0,500))
                        }}>500</li>
                    </ul>
                    <ul className={styles.eventsArea}>

                        {ev.map((el, i) => {
                        let classes;
                        if (el['EventClassType'] === 'alarm') {
                            classes = `${styles.event_item} ${styles.alarm}`;
                        } else if (el['EventClassType'] === 'disarm') {
                            classes = `${styles.event_item} ${styles.disarm}`;
                        } else if (el['EventClassType'] === 'arm') {
                            classes = `${styles.event_item} ${styles.arm}`;
                        } else if (el['EventClassType'] === 'fault') {
                            classes = `${styles.event_item} ${styles.fault}`;
                        } else {
                            classes = `${styles.event_item} ${styles.other}`;
                        }
                        return <li className={classes} key={i}><div><Moment format="DD.MM.YY HH:mm:ss">{el['DateTime']}</Moment><p>{el['EventClassName']} Р-Ш/П: {el['PartNumber']} -  {el['ZoneUser']}</p></div><p className="event_desc">{el['EventDesc']}</p></li>
                    })}</ul>
                </div> : null}
            </div>
        </div>
    );
}



export default DopInfo;
