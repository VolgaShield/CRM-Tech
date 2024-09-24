import React, {useEffect, useRef, useState} from 'react';
import styles from './Comment.module.scss'
import Back from '../../img/back.png'
import Send from '../../img/send.png'
import Sender from "./Sender";
import Other from "./Other";
import {setOpenComment} from "../../state/openComment";
import {sendComment} from "../../actions/SendComment";
import {useStore} from "effector-react";
import {$user} from "../../state/user";

import Loader from "../Loader/Loader";
import {$commentsStatus, getComment} from "../../state/comments";

const Comment = ({user}) => {
    const sender = useStore($user);

    const comments = useStore($commentsStatus);
    const [text, setText] = useState('')

    useEffect(() => {
        getComment(user.id)
    }, [])

    return (
        <div className={styles.commentWrapper}>
            <header className={styles.commentHeader}>
                <img src={Back} alt="" onClick={() => setOpenComment(false)}/>
                <p>{user.name}</p>
            </header>
            <ul className={styles.messageWrapper}>
                {comments === 'loading' ? <Loader/> : comments.length ? comments.map(el => el[1] === sender.ID ? <Other key={el[0]} message={el[3]} user={el[6]} date={el[4]}/> : <Sender key={el[0]} message={el[3]} user={el[6]} date={el[4]}/>) : <p className={styles.noMessages}>Сообщений нет!</p>}
            </ul>
            <div className={styles.inputWrapper}>
                <textarea className={styles.textArea} value={text} onChange={(e) => setText(e.target.value)} />

                <div className={styles.inputButtons}>

                    <input type="image" src={Send} onClick={() => {

                        if (text.length >= 1) {
                            sendComment(sender.ID, `${sender.LAST_NAME} ${sender.NAME[0]}.${sender.SECOND_NAME[0]}`, user.name, user.id, text, 0)
                            setText('')
                        }
                    }}/>
                </div>
            </div>
        </div>
    );
}



export default Comment;
