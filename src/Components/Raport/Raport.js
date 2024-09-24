import React, {useState} from 'react';
import styles from "./Raport.module.scss";
import DatePicker from "./DatePicker";

import {useStore} from "effector-react";
import Drop from '../../img/dropdown.png'
import {getCompleted, $completed} from "../../state/getCompleted";

const RaportItem = ({tech, tasks}) => {
    const [open, setOpen] = useState(false);

    function declOfNum(n, text_forms) {
        n = Math.abs(n) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 === 1) { return text_forms[0]; }
        return text_forms[2];
    }

    return (
        <div>
            <div className={styles.title} onClick={() => setOpen(prevState => !prevState)}>
                {!open ? <img src={Drop} alt="" className={styles.img}/> : <img src={Drop} alt="" className={styles.rotate180}/>} <p>{tech} - {tasks.length} {declOfNum(tasks.length, ['Задача', 'Задачи', 'Задач'])}</p>
            </div>
            {open ?
                <div className={styles.table}>
                    <div className={styles.table_row}>
                        <p className={styles.type}></p>
                        <p className={styles.completed}>Выполнено</p>
                        <p className={styles.payable}>Платные</p>
                        <p className={styles.not_payable}>Бесплатные</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>ТО</p>
                        <p className={styles.completed}>{tasks.filter(el => el[8] === 'ТО').length}</p>
                        <p className={styles.payable}>-</p>
                        <p className={styles.not_payable}>-</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>Заявка</p>
                        <p className={styles.completed}>{tasks.filter(el => el[8] === 'Заявка').length}</p>
                        <p className={styles.payable}>{tasks.filter(el => el[8] === 'Заявка' && el[14] === 'Платная').length}</p>
                        <p className={styles.not_payable}>{tasks.filter(el => el[8] === 'Заявка' && el[14] === 'Бесплатная').length}</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>Монтаж</p>
                        <p className={styles.completed}>{tasks.filter(el => el[8] === 'Монтаж').length}</p>
                        <p className={styles.payable}>-</p>
                        <p className={styles.not_payable}>-</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>СО</p>
                        <p className={styles.completed}>{tasks.filter(el => el[8] === 'СО').length}</p>
                        <p className={styles.payable}>-</p>
                        <p className={styles.not_payable}>-</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>Демонтаж</p>
                        <p className={styles.completed}>{tasks.filter(el => el[8] === 'Демонтаж').length}</p>
                        <p className={styles.payable}>-</p>
                        <p className={styles.not_payable}>-</p>
                    </div>
                    <div className={styles.table_row}>
                        <p className={styles.type}>Повторы</p>
                        <p className={styles.completed}>{tasks.filter(el => el[3] === 'Повтор').length}</p>
                        <p className={styles.payable}>-</p>
                        <p className={styles.not_payable}>-</p>
                    </div>
                </div>
                : null}
        </div>
    )
}

const Raport = () => {
    const data = useStore($completed);

    return (
        <div className={styles.wrapper}>
            <DatePicker get={getCompleted}/>
            <div>
                <RaportItem tech={'Киселёв'}
                            tasks={data.filter(el => el[7].indexOf('Киселёв') !== -1)}/>
                <RaportItem tech={'Ларионов'}
                            tasks={data.filter(el => el[7].indexOf('Ларионов') !== -1)}/>
                <RaportItem tech={'Кирюшкин'}
                            tasks={data.filter(el => el[7].indexOf('Кирюшкин') !== -1)}/>
                <RaportItem tech={'Малахов'}
                            tasks={data.filter(el => el[7].indexOf('Малахов') !== -1)}/>
                <RaportItem tech={'Шалыгин'}
                            tasks={data.filter(el => el[7].indexOf('Шалыгин') !== -1)}/>
            </div>
        </div>
    );
}



export default Raport;
