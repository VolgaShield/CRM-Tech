import React from 'react';
import styles from './TaskList.module.scss'

const TaskList = (props) => {

    return (
        <div className={styles.TaskList}>
            <h3>{props.title}<span> - {props.children.length}</span></h3>
            <ul >
                {props.children}
            </ul>
        </div>

    );
}



export default TaskList;
