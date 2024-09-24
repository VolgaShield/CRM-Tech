import React, {useCallback, useMemo, useState} from 'react';
import styles from './CollapseItem.module.scss'
import moment from 'moment'
import PopUp from "../../PopUp/PopUp";
import {$selected, setLongtouch, setSelected} from "../../../../state/longTouch";
import {useStore} from "effector-react";
import LongTouchWrapper from "../../../TaskItem/LongTouchWrapper";
import {$today} from "../../../../state/tasks";


const getTime = (time) => {
    const min = time*60;
    let hours = Math.trunc(min/60);
    let minutes = min % 60;
    return `${hours !== 0 ? hours + 'ч. ' : ''} ${minutes !== 0 ? minutes + 'м.' : ''}` ;
};

const CollapseItem = ({item}) => {
    const selected = useStore($selected);
    const today = useStore($today);

    const [show, setShow] = useState(false);

    const time = useCallback(
        () => {
          return getTime(item[34]);
        },
        [],
    );


    return (
        <div style={{position: 'relative'}}>
            <li className={styles.item} onClick={() => {
                // if (item[8] === 'СО' || item[8] === 'Монтаж' || item[3] === 'Повтор' || item[3] === 'Нет контрольного события') {
                //     setShow(true)
                // } else {
                //     if (!today.filter(el => el[8] === 'СО' || el[8] === 'Монтаж' || el[3] === 'Повтор' || el[3] === 'Нет контрольного события').length ) {
                //         setShow(true)
                //     } else {
                //         alert('Для начала распределите все Монтажи, СО, Повторы, Нет К.С')
                //     }
                // }

                setShow(true)
            }} >
                <div className={`${styles.flex} `}>
                    <p className={`${styles.red}`}>{item[3] ? item[3] : item[8]}</p>
                    <p>{item[47]}</p>
                </div>
                <div className={`${styles.titles}`}>
                    <p>{item[2]}</p>
                    <p className={styles.gray}>{item[4]}</p>

                    {/* <p className={styles.problem}>{item[13]}</p> */}
                    {item[61] === 'Y' ? <b>Фиксированно {moment(item[51]).format('DD.MM HH:mm:ss')}</b> : null}
                    <div className={`${styles.flex} `} style={{marginTop: 5}}>
                        <p >Ч/Ч: <span className={styles.problem}>{item[34]}</span></p>
                        <p>{moment(item[17]).format('DD.MM HH:mm:ss')}</p>
                    </div>

                </div>

                {show ? <PopUp item={item} time={time()} close={(a) => setShow(a)}/> : null}
            </li>
            {/*{selected.length ? <LongTouchWrapper data={item[0]}/> : null}*/}

        </div>

    );
};

export default CollapseItem;
