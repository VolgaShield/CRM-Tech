import React, {useCallback, useRef} from 'react';
import styles from "./Maps.module.scss";
import {$mapNav, setMapNav} from "../../state/mapNav";
import {useStore} from "effector-react";
import {$notCompCount} from "../../state";




const MapNav = () => {
    const nav = useStore($mapNav);
    const notComp = useStore($notCompCount)
    return (
        <ul className={styles.mapNav}>
            <li onClick={() => {
                if (nav === 'req') {
                    setMapNav("null")
                } else {
                    setMapNav("req")
                }
            }} style={nav === 'req' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.req}</p><img src="https://volga24bot.com/icons/req.png"/>Заявки</li>
            <li onClick={() => {
                if (nav === 'to') {
                    setMapNav("null")
                } else {
                    setMapNav("to")
                }
            }} style={nav === 'to' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.toQ + notComp.toM}</p><img src="https://volga24bot.com/icons/to.png"/>ТО</li>
            <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png"/>Претензии</li>
            <li onClick={() => {
                if (nav === 'mon') {
                    setMapNav("null")
                } else {
                    setMapNav("mon")
                }
            }} style={nav === 'mon' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.mon}</p><img src="https://volga24bot.com/icons/mon.png"/>Монтажи</li>
            <li onClick={() => {
                if (nav === 'dem') {
                    setMapNav("null")
                } else {
                    setMapNav("dem")
                }
            }} style={nav === 'dem' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.dem}</p><img src="https://volga24bot.com/icons/dem.png"/>Демонтажи</li>
            <li onClick={() => {
                if (nav === 'so') {
                    setMapNav("null")
                } else {
                    setMapNav("so")
                }
            }} style={nav === 'so' ? {fontWeight: 500} : null}><p className={styles.counter}>{notComp.so}</p><img src="https://volga24bot.com/icons/so.png"/>СО</li>
        </ul>
    );
}



export default MapNav;
