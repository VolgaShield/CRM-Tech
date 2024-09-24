import React, {useState} from 'react';
import styles from './Collapse.module.scss'
import Drop from '../../../img/dropdown.png'
import {useStore} from "effector-react";
import {$allReqStatus} from "../../../state";
import moment from "moment";
function getDays(date) {
    return new Date(`${date}T00:00:00`).getTime()
}

const Collapse = ({defaultOpen = false, title, children}) => {

    const [isOpen, setOpen] = useState(defaultOpen)

    return (
        <div className={styles.wrapper}>
            <div className={styles.dropdowner} onClick={() => setOpen(prevState => !prevState)}>
                <p>{title} - {children.length} {title === 'Сегодня' ?  <span style={{color: "blue", marginLeft: 20}}> </span> : ''}</p>
                <img src={Drop} alt="" className={isOpen ? styles.rotate : null}/>
            </div>
            {isOpen ? <ul className={styles.item_list}>

                {children}
            </ul> : null}
        </div>
    );
};

export default Collapse;
