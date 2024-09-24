import React, {useEffect} from 'react';
import styles from './History.module.scss'
import {useStore} from "effector-react";
import {$filtredReq, setFilterReq, setFilterReq2} from "../../state/Search";
import HistoryItem from "./HistoryItem";


const History = ({block, address, setInfo}) => {
    const tasks = useStore($filtredReq)

    useEffect(() => {
        setFilterReq(block);
        setFilterReq2(address);
    }, [block, address])

    return (
        <div className={styles.history_wrapper}>
            {block ?
                <ul>
             {tasks.length ? tasks.map(el => <HistoryItem data={el} key={el[0]} setInfo={setInfo}/>) : <p style={{textAlign: 'center', paddingTop: 20, fontWeight: 500}}>Заявок не обнаружено!</p>}
            </ul> : <p style={{textAlign: 'center', paddingTop: 20, fontWeight: 500}}>№ объекта отсутствует!</p>}
        </div>
    );
}



export default History;
