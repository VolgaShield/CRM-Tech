import React from 'react';
import styles from './History.module.scss'
import moment from 'moment'
import {setShowTask} from "../../state/showTask";


const HistoryItem = ({data, setInfo}) => {

    return (
        <div onClick={() => {
            setShowTask(data)
            setInfo()
        }} className={`${styles.history_item} ${data[18] === 'Новая' || data[18] === 'Брак' ? styles.red : data[18] === 'Выезд не требуется' || data[18] === 'Не выезжали' ? styles.gray : styles.green}  ${data[18] === 'В работе' ? styles.orange : null} ` }>
            <p className={`${styles.type} ${data[18] === 'Новая' || data[18] === 'Брак' ? styles.redTitle : data[18] === 'Выезд не требуется' || data[18] === 'Не выезжали' ? styles.grayTitle : styles.greenTitle} ${data[18] === 'В работе' ? styles.orangeTitle : null} `}>{data[8]} <span style={{float: "right"}}> {data[18]}</span></p>
            <p className={styles.main_title}><span style={{fontWeight: 400}}>Причина: </span>{data[13]}</p>
            {data[12] ? <p className={styles.main_title}><span style={{fontWeight: 400}}>Что сделано: </span>{data[12]}</p> : null}
            {data[15] ? <p className={styles.main_title}><span style={{fontWeight: 400}}>Комментарий: </span>{data[15]}</p> : null}
            <p className={styles.main_title}><span style={{fontWeight: 400}}>Ответственный: </span>{data[7]}</p>
            {data[23] !== '0000-00-00 00:00:00' ? <p className={styles.time}>{moment(data[23]).format("DD.MM.YYYY")}</p> : <p className={styles.time}>{moment(data[17]).format("DD.MM.YYYY")}</p>}
        </div>
    );
}

export default HistoryItem;
