import React from 'react';
import {ChatList, Input} from "react-chat-elements";
import styles from "../Search.module.scss";
import Send from "../../../img/send.png";
import {sendComment} from "../../../actions/SendComment";
import './ChatWrapper.module.scss'


const ChatWrapper = () => {
    return (
        <div>
            <p style={{textAlign: 'center', color: 'gray'}}>Комментарии: </p>
            <ChatList
                className={`${styles.messageWrapper}`}
                dataSource={comments.map(el => ({avatar: avatars[el[1]],title: el[5], subtitle: el[2], date: new Date(el[3])}))}
            />
            <div className={styles.textarea}>
                <footer className={styles.footer}>
                    <Input
                        className={styles.input}
                        placeholder="Сообщение..."
                        multiline={true}
                        ref={input}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <img src={Send} alt="" onClick={() => {
                        if (value.length >= 1) {
                            sendComment(sender.ID, `${sender.LAST_NAME} ${sender.NAME[0]}.${sender.SECOND_NAME[0]}`, value, [current.ID])
                            input.current.input.value = '';
                        }}
                    }/>
                </footer>
            </div>


        </div>
    );
};

export default ChatWrapper;