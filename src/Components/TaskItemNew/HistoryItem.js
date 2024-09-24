import React from 'react';
import styles from "./MyTasksItem.module.scss";
import Moment from "react-moment";

const HistoryItem = ({title,  withLine, active = [], failed, activeText = [], comm}) => {
    return (
        <div className={`${styles.processItem} ${active.length || activeText.length ? styles.activeProcess : null} ${failed ? styles.failedProcess : null}`}>
            {withLine ? <div className={styles.line}></div> : null}
            <div className={styles.circle}></div>
            <div>
                <p>{title}</p>
                {activeText.length && !failed ? <p style={{fontSize: 14, color: "black"}}>{activeText}</p> : null}
                {activeText.length && failed ? <p style={{fontSize: 14, color: "red"}}>{activeText}</p> : null}
                {title === 'Завершил работу' ? <p style={{color: 'green', fontWeight: 500}} >{comm}</p> : null}
                {active.length ? <p style={{fontSize: 11, color: "grey"}}><Moment format={'DD.MM.YYYY HH:mm:ss'}>{active[1]}</Moment></p> : null}
            </div>
        </div>
        );
}

export default HistoryItem;
