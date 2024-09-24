import React from 'react';
import styles from './Search.module.scss'
import SearchImg from '../../../img/search.png'

const Search = ({value, setValue}) => {
    return (
        <div className={styles.wrapper}>
            <label>
                ПОИСК
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
                <img src={SearchImg} alt=""/>
            </label>

        </div>
    );
};

export default Search;
