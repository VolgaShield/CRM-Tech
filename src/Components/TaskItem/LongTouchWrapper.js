import React, {useState} from 'react';
import styles from './LongTouchWrapper.module.scss'
import {$selected, deleteSelected, setSelected} from "../../state/longTouch";
import {useStore} from "effector-react";






const LongTouchWrapper = ({data}) => {
    const sel= useStore($selected);
    const [selected, setSelected2] = useState(() => {
        if (sel.indexOf(data)+1) {
            return true
        } else {
            return false
        }

    });

    return (
        <div className={selected ? styles.selected : styles.notselected} onClick={() => {

            setSelected2(prevState => !prevState)
            if (!selected) {
                setSelected(data);
            } else {
                deleteSelected(data)

            }

        }}
        >
            <input type="checkbox" onChange={(e) => {
                if (e.target.checked) {
                    setSelected(data);
                    setSelected2(e.target.checked)
                } else {
                    deleteSelected(data)
                    setSelected2(e.target.checked)
                }
            }} className={styles.checkbox} checked={selected}/>
        </div>
    );
}



export default LongTouchWrapper;
