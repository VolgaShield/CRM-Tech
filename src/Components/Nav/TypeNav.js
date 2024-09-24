import React from 'react';
import styles from './Nav.module.scss'
import {useStore} from "effector-react";
import {$nav, $typenav, setTypeNav} from "../../state/Nav";
import {$counters} from "../../state";

const TypeNav = () => {
    const nav = useStore($typenav);

    const count = useStore($counters);
    const nav2 = useStore($nav);


    return (
        <>
        <ul className={styles.typeNavWrapper}>
                <li className={nav === 'total' ? styles.totalActive : null} style={{backgroundColor: '#00b9ff'}} onClick={() => setTypeNav('total')}><p className={styles.count}>{count.NEW[nav2]}</p><p>Новые</p></li>
                <li className={nav === 'COMP' ? styles.totalActive : null} style={{backgroundColor: '#00cc67'}} onClick={() => setTypeNav('COMP')}><p className={styles.count}>{count.COMP[nav2]}</p><p>Выполнено</p></li>
                <li className={nav === 'MOVING' ? styles.totalActive : null} style={{backgroundColor: '#ff8000'}} onClick={() => setTypeNav('MOVING')}><p className={styles.count}>{count.MOVING[nav2]}</p><p>В пути</p></li>
                <li className={nav === 'INJOB' ? styles.totalActive : null} style={{backgroundColor: '#ffe000'}} onClick={() => setTypeNav('INJOB')}><p className={styles.count}>{count.INJOB[nav2]}</p><p>В работе</p></li>
                <li className={nav === 'NEW' ? styles.totalActive : null} style={{backgroundColor: '#ff030080'}} onClick={() => setTypeNav('NEW')}><p className={styles.count}>{count.NC[nav2]}</p><p>Невыполнено</p></li>

        </ul>
            {nav === 'NEW' || nav === 'DEFFECT' ? <div className={styles.typeNavWrapper} style={{listStyle: 'none'}}>
                <li className={nav === 'NEW' ? styles.totalActive : null} style={{backgroundColor: '#ff030080'}} onClick={() => setTypeNav('NEW')}><p className={styles.count}>{count.NC[nav2]}</p><p>Невыполнено</p></li>
                <li className={nav === 'DEFFECT' ? styles.totalActive : null} style={{backgroundColor: 'rgb(201,13,13)'}} onClick={() => setTypeNav('DEFFECT')}><p className={styles.count2}>{count.DEFFECT[nav2]}</p><p className={styles.white}>Просрочено</p></li>
            </div> : null}
    </>
    );
}


export default TypeNav;
