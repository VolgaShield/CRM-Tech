import React, {useEffect, useState} from 'react';

import styles from './TechControl.module.scss'
import {useStore} from "effector-react";
import {$selected, cleareSelected} from "../../state/longTouch";
import {changeTech} from "../../actions/changeTech";
import {getAllReq} from "../../state";
import {$usersStatus} from "../../state/getUsers";


const ChangeTechWrapper = ({func}) => {
    const sel= useStore($selected);
    const users = useStore($usersStatus)
    return (
        <div className={styles.changeTechWrapper}>
            <div className={styles.changeTechBlock}>


            </div>
        </div>
    );
}



export default ChangeTechWrapper;
