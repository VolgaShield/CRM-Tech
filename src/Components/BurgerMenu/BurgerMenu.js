import React, { useState } from 'react';

import styles from './BurgerMenu.module.scss';
import {$nav, setNav} from "../../state/main_nav";
import {useStore} from "effector-react";
import {$user, setUser} from "../../state/user";

const BurgerMenu = ({ active, setActive }) => {
    const nav = useStore($nav);
    const user = useStore($user);

    return (
        <div className={active ? `${styles.menu} ${styles.active}` : styles.menu} style={{display: 'flex'}}>
            <div
                className={styles.menu__content}
            >
                <ul>
                    <li>
                        <a onClick={() => {
                            setNav('control')
                            setActive(false)
                        }} className={nav === 'control' ? styles.activeItem : null}>Задачи</a>
                    </li>
                    <li>
                        <a onClick={() => {
                            setNav('graph')
                            setActive(false)
                        }} className={nav === 'graph' ? styles.activeItem : null}>Графики</a>
                    </li>
                    <li>
                        <a onClick={() => {
                            setNav('map')
                            setActive(false)
                        }} className={nav === 'map' ? styles.activeItem : null}>Карта</a>
                    </li>
                    <li>
                        <a onClick={() => {
                            setNav('plane')
                            setActive(false)
                        }} className={nav === 'plane' ? styles.activeItem : null}>Планирование</a>
                        {/*<a className={nav === 'plane' ? styles.activeItem : null}>Распределение задач (В разработке)</a>*/}
                    </li>
                    <li>
                        <a onClick={() => {
                            setNav('stats')
                            setActive(false)
                        }} className={nav === 'stats' ? styles.activeItem : null}>Статистика</a>
                    </li>
                    {user.UF_DEPARTMENT[0]===15 || user.UF_DEPARTMENT[0] === 13 || user.UF_DEPARTMENT[0] === 5 || user.UF_DEPARTMENT[0] === 1   ?
                    <li>
                        <a onClick={() => {
                            setNav('equipment')
                            setActive(false)
                        }} className={nav === 'equipment' ? styles.activeItem : null}>Инвентарь</a>
                    </li>
                    :null}
                    <li>
                        {(user.UF_DEPARTMENT[0] === 51 || user.UF_DEPARTMENT[0] === 25 || user.UF_DEPARTMENT[0] === 37 || user.UF_DEPARTMENT[0] === 41 || user.UF_DEPARTMENT[0] === 43 || user.UF_DEPARTMENT[0] === 45) && user.DEFAULT_DEP === undefined ? null : <select className={styles.select_reg} name="type_select" value={user?.UF_DEPARTMENT[0]} onChange={(e) => {
                            user.DEFAULT_DEP && user.DEFAULT_DEP.length ? setUser({...user, UF_DEPARTMENT: [+e.target.value]}) : setUser({...user, DEFAULT_DEP: user.UF_DEPARTMENT, UF_DEPARTMENT: [+e.target.value]})
                            setActive(false)
                        }}>
                            <option value="all">Все</option>
                            <option value="5">Астрахань</option>
                            <option value="25">Ахтубинск</option>
                            <option value="51">Элиста</option>
                            <option value="41">Володарский</option>
                            <option value="43">Знаменск</option>
                            <option value="37">Лиман</option>
                            <option value="45">Чёрный Яр</option>
                        </select>}
                    </li>

                </ul>
            </div>
            <div className={styles.click_wrapper} onClick={() => setActive(false)}>

            </div>
        </div>
    );
};

export default BurgerMenu;