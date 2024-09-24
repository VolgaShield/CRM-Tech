import React, { useCallback, useRef } from 'react';
import styles from "./Maps.module.scss";
import { $mapNav, setMapNav } from "../../state/mapNav";
import { useStore } from "effector-react";
import { $notCompCount } from "../../state";




const MapHistoryNav = (locations) => {
    const nav = useStore($mapNav);
    const notComp = useStore($notCompCount)
    return (
        <ul className={styles.mapHistoryNav}>
           
            
            
           <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
             
             <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
             
             <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
             
             <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
             
             <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
            <li onClick={() => {
                if (nav === 'pre') {
                    setMapNav("null")
                } else {
                    setMapNav("pre")
                }
            }} style={nav === 'pre' ? { fontWeight: 500 } : null}><p className={styles.counter}>{notComp.pre}</p><img src="https://volga24bot.com/icons/red4.png" />Претензии</li>
            

        </ul>
    );
}



export default MapHistoryNav;
