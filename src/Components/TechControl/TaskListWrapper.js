import React, {useEffect, useState} from 'react';

import styles from './TechControl.module.scss'
import {useStore} from "effector-react";
import {$scrollY} from "../../state/scrollY";



const TaskListWrapper = (props) => {
    const scroll = useStore($scrollY);

    useEffect(() => {
        if (!props.sel.length) {
            window.scrollTo(0, scroll)
        }

    }, [props])


    return (

            <ul className={styles.taskItem}>
                {props.children}
            </ul>


    );
}



export default TaskListWrapper;
