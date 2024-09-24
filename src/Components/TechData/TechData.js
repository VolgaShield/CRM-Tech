import React, {useEffect} from 'react';
import styles from './TechData.module.scss'
import Close from "../../img/close.png";
import {showTaskData} from "../../state/myTask";


const TechData = ({close, data={}}) => {
    //console.log(data)
    return (
        <div className={styles.wrapper}>
            <header> <img src={Close} alt="" onClick={close}/></header>
            <div>
                <p></p>
            </div>
        </div>
    );
}



export default TechData;
