import React, {useEffect, useState} from 'react';
import styles from './Search.module.scss'
import {useStore} from "effector-react";
import {$scrollY} from "../../state/scrollY";


const SearchItemsWrapper = (props) => {

    const scroll = useStore($scrollY);

    useEffect(() => {
        window.scrollTo(0, scroll)
    }, [props])

    return (
        <ul className={styles.searchItems}>
            {props.children}
        </ul>
    );

}



export default SearchItemsWrapper;
