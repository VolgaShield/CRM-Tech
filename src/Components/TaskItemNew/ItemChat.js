import React, {useEffect, useRef, useState} from 'react';
import styles from "./ItemChat.module.scss";
import { Input, ChatList} from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import Send from '../../img/send.png'
import {useStore} from "effector-react";
import {$user} from "../../state/user";
import {$commentsStatus, getComment} from "../../state/comments";
import {sendComment} from "../../actions/SendComment";

const avatars = {
    1: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/63/23365dd92c1f65a6eb81283cfddb6812/main/396/396032264fd6c5d3973a4e3d77715a87/avatar.png?h=volga-shield.bitrix24.ru',
    87: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/18147/23365dd92c1f65a6eb81283cfddb6812/main/2df/2df72287ed250054597721cc5706f27b/avatar.png?h=volga-shield.bitrix24.ru',
    211: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/84809/23365dd92c1f65a6eb81283cfddb6812/main/73f/73f26ddc3c733c405926bd161b776e53/Bezymyannyy.png?h=volga-shield.bitrix24.ru',
    277: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/209159/23365dd92c1f65a6eb81283cfddb6812/main/0c8/0c88f49799f0bd6014376a6e43a9ed26/avatar.png?h=volga-shield.bitrix24.ru'
}

const Chat = ({item}) => {
    const [value, setValue] = useState('')
    const sender = useStore($user);
    const comments = useStore($commentsStatus);

    const input = useRef('')
    useEffect(() => {
        const req = comments.filter(el => el[1] !== sender.ID && el[6] !== 0).map(el => el[0]);


        if (req.length) {
            let formData = new FormData();

            formData.append('ids', JSON.stringify(req))
            fetch('https://volga24bot.com/kartoteka/api/tech/readComments.php',{

                method: "POST",
                body: formData
            })
                .then(res => getComment(item[0]))
                .catch(function(res){ console.log(res) })


        }


    }, [])

    return (
        <div className={styles.chatWrapper}>

            <ChatList
                className={`${styles.messageWrapper}`}

                dataSource={comments.map(el => ({avatar: avatars[el[1]],title: el[5], subtitle: el[2], date: new Date(el[3]), unread: el[1] !== sender.ID ? false : !Number(el[6])}))}
                   />

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
                        sendComment(sender.ID, `${sender.LAST_NAME} ${sender.NAME[0]}.${sender.SECOND_NAME[0]}`, value, item)
                        input.current.input.value = '';
                    }}
                }/>
            </footer>
        </div>
    );
}



export default Chat;
