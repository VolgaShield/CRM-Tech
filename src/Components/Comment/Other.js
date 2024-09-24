import React from 'react';
import styles from './Comment.module.scss'
import Moment from "react-moment";


const Other = ({user, message, date}) => {

    return (
        <li className={`${styles.message} ${styles.messageOther}`}>
            <div style={{width: "45%"}}>
                <p className={styles.user}>{user}</p>
                <p className={styles.messageText}>
                    {message}
                </p>
                <p className={styles.time}><Moment format="HH:mm DD.MM">
                    {date}
                </Moment></p>
            </div>

        </li>
    );
}



export default Other;
