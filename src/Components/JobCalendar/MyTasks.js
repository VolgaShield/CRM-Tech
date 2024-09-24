import React, {useEffect, useRef, useState} from 'react';
import styles from './Search.module.scss'
import Close from '../../img/close.png'
import {$myTasksNav, setMyTasksNav, setOpenComment} from "../../state/openComment";
import Moment from "react-moment";
import {useStore} from "effector-react";
import {$myTask, $taskDataStatus, getMyTask, showTaskData} from "../../state/myTask";
import MyTaskItem from "../MyTasks/MyTaskItem";
import {$depStatus, $user} from "../../state/user";
import {setShowTask} from "../../state/showTask";
import TaskItem from "../TaskItem/TaskItem";
import { Input, ChatList} from 'react-chat-elements'
import Trash from '../../img/trashRed.png'
import moment from 'moment'
import Send from "../../img/send.png";
import {sendComment} from "../../actions/SendComment";
import {$commentsStatus, getComment} from "../../state/comments";
import {$navMyTasks, setNavMyTasks} from "../../state/Nav";

const avatars = {
    1: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/63/23365dd92c1f65a6eb81283cfddb6812/main/396/396032264fd6c5d3973a4e3d77715a87/avatar.png?h=volga-shield.bitrix24.ru',
    87: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/18147/23365dd92c1f65a6eb81283cfddb6812/main/2df/2df72287ed250054597721cc5706f27b/avatar.png?h=volga-shield.bitrix24.ru',
    211: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/84809/23365dd92c1f65a6eb81283cfddb6812/main/73f/73f26ddc3c733c405926bd161b776e53/Bezymyannyy.png?h=volga-shield.bitrix24.ru',
    277: 'https://bitrix2.cdnvideo.ru/b11017596/resize_cache/209159/23365dd92c1f65a6eb81283cfddb6812/main/0c8/0c88f49799f0bd6014376a6e43a9ed26/avatar.png?h=volga-shield.bitrix24.ru'
}

const MyTasks = ({customer, tasks, info}) => {
    const [value, setValue] = useState('')
    const comments = useStore($commentsStatus);
    const sender = useStore($user);
    const navI = useStore($navMyTasks);
    const input = useRef('')
    const list = useRef()
    const showTask = useStore($taskDataStatus);
    const taskData = useStore($taskDataStatus);
    const user = useStore($user);
    const myTasks = useStore($myTask);

    const nav = useStore($myTasksNav);
    const dep = useStore($depStatus);
    const [current, setCurrent] = useState({});
    const [typeComment, setTypeComment] = useState('Претензия')
    const [checkbox, setCheckBox] = useState(false)
    const [commentNav, setCommentNav] = useState(null)
    useEffect(() => {
        if (user.ID !== 0 ) {
            setCurrent(dep.length ? dep.find(el => el.LAST_NAME === customer) : {})
            getMyTask(user.ID)
            getComment([current.ID])
        }
    }, [taskData, user, current])

    return (
       <div>
            <header className={styles.headerWrapper} style={{zIndex: 99999999}}>
                <div className={styles.searchHeader}>
                    <img src={Close} alt="" onClick={() => setOpenComment(false)}/>
                </div>
            </header>
           <ul className={styles.navigation}>
               <li className={navI === 'info' ? styles.active2 : null} onClick={() => setNavMyTasks('info')}>Инфо</li>
               <li className={navI === 'tasks' ? styles.active2 : null} onClick={() => setNavMyTasks('tasks')}>Задачи</li>
           </ul>
           {navI === 'info' ? <div className={styles.tech_info}>
                <div className={styles.main_data}>
                    <div >
                        <img src={current.PERSONAL_PHOTO} alt="Photo" className={styles.avatar}/>
                    </div>
                    <div className={styles.titles}>
                        <p className={styles.title}>{current.LAST_NAME} {current.NAME} {current.SECOND_NAME}</p>
                        <p>{current.WORK_POSITION}</p>
                        <a href="tel:555-555-5555">{current.WORK_PHONE}</a>
                    </div>
                </div>
                <div className={styles.location_data}>
                    {tasks.filter(el => el[18] === 'В работе' || el[18] === 'Выпонено').length ? <p>Начало дня: <span style={{fontWeight: 500}}>{moment(tasks.find(el => el[18] === 'В работе' || el[18] === 'Выполнена')[5]).format('HH:mm')}</span></p> : null}
                    {tasks.find(el => el[18] === 'В работе') && <p>Сейчас: <span style={{fontWeight: 500}}>{tasks.find(el => el[18] === 'В работе')[4]}</span></p>}
                    {tasks.filter(el => el[18] === 'В работе').length === 0 && tasks.filter(el => el[18] === 'Выполнена').length ? <p>Был: в  <span style={{fontWeight: 500}}>{tasks.filter(el => el[18] === 'Выполнена')[tasks.filter(el => el[18] === 'Выполнена').length - 1][4]} в {moment(tasks.filter(el => el[18] === 'Выполнена')[tasks.filter(el => el[18] === 'Выполнена').length - 1][6]).format('HH:mm')}</span></p> : null}
                    {tasks.length === 0 ? info ? <p style={{fontWeight: 500}}>Сегодня еще небыл ни на 1 объекте!</p> : <p style={{fontWeight: 500}}>Не заступил!</p> :  null}
                </div>

                <div>
                    <p style={{textAlign: 'center', color: 'gray'}}>Комментарии: </p>
                    {/*<ChatList*/}
                    {/*    className={`${styles.messageWrapper}`}*/}
                    {/*    dataSource={comments.map(el => ({avatar: avatars[el[1]],title: el[5], subtitle: el[2], date: new Date(el[3])}))}*/}
                    {/*/>*/}
                    <div className={styles.legend} style={{marginBottom: 5}}>
                        <div className={styles.legendWrapper} onClick={() => commentNav === 'Претензия' ? setCommentNav(null) : setCommentNav('Претензия')} style={commentNav === 'Претензия' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                            <div className={`${styles.circle2} ${styles.red}`}></div>

                            <p>Претензия</p>
                        </div>
                        <div className={styles.legendWrapper} onClick={() => commentNav === 'Замечание' ? setCommentNav(null) : setCommentNav('Замечание')}  style={commentNav === 'Замечание' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                            <div className={`${styles.circle2} ${styles.orange}`}></div>
                            <p>Замечание</p>
                        </div>
                        <div className={styles.legendWrapper} onClick={() => commentNav === 'Коммент' ? setCommentNav(null) : setCommentNav('Коммент')}  style={commentNav === 'Коммент' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                            <div className={`${styles.circle2} ${styles.green}`}></div>
                            <p>Коммент</p>
                        </div>
                        <div className={styles.legendWrapper} onClick={() => commentNav === 'Другое' ? setCommentNav(null) : setCommentNav('Другое')}  style={commentNav === 'Другое' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                            <div className={`${styles.circle2} ${styles.blue}`}></div>
                            <p>Другое</p>
                        </div>
                    </div>
                    <ul className={styles.message_list}>
                        {comments.filter(el => commentNav !== null ? el[7].indexOf(commentNav) !== -1 : true).filter(el => (el[8] === '1' && el[1] === user.ID) || (el[8] === '0')).reverse().map(el => {

                            return (
                                <li className={styles.message}>
                                    <div className={`${styles.circle2} ${el[7] === 'Другое' ? styles.blue : null} ${el[7] === 'Коммент' ? styles.green : null} ${el[7] === 'Замечание' ? styles.orange : null} ${el[7] === 'Претензия' ? styles.red : null}`}></div>
                                    <div style={{marginLeft: 10, width: '100%'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}><p style={{fontWeight: 700, fontSize: 13}}>{el[5]}</p><p>{moment(el[3]).format('DD.MM HH:mm')}</p></div>
                                        <p style={{paddingTop: 5, paddingBottom: 5}}>{el[2]}</p>
                                        {el[8] === '1' ? <p style={{fontSize: 12, color: 'gray'}}>Скрыто</p> : null}
                                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                            {user.ID === el[1] ? <img src={Trash} alt="" className={styles.trash} onClick={() => {
                                                let answer = window.confirm('Удалить коммент?')
                                                if (answer) {
                                                    fetch(`https://volga24bot.com/kartoteka/api/tech/deleteComment.php?id=${el[0]}`)
                                                        .then(res => res.json())
                                                        .then(res => {
                                                            if (res) {
                                                                getComment([current.ID])
                                                            } else {
                                                                alert('Прозошла ошибка удаления комментария!')
                                                            }
                                                        })
                                                }
                                            }}/> : null}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <div className={styles.textarea}>
                        <footer className={styles.footer}>
                            <select name="das" id="" onChange={(e) => {
                                setTypeComment(e.target.value)
                            }} value={typeComment} className={styles.select_type}>
                                <option value="Претензия">Претензия</option>
                                <option value="Замечание">Замечание</option>
                                <option value="Коммент">Коммент</option>
                                <option value="Другое">Другое</option>
                            </select>
                            <Input
                                className={styles.input}
                                placeholder="Сообщение..."
                                multiline={true}
                                ref={input}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: 15}}>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" checked={checkbox} onChange={(e) => {
                                        setCheckBox(!checkbox)
                                    }}/>
                                    Скрытое
                                </label>
                                <button onClick={() => {
                                    if (value.length >= 1) {
                                        sendComment(sender.ID, `${sender.LAST_NAME} ${sender.NAME[0]}.${sender.SECOND_NAME[0]}`, value, [current.ID], typeComment, checkbox)
                                        input.current.input.value = '';
                                    }}
                                } className={styles.send_button}>
                                    Отправить
                                </button>
                            </div>

                        </footer>
                    </div>


                </div>
            </div> : <div>
               <div className={styles.legend}>
                   <div className={styles.legendWrapper} onClick={() => nav === 'Новая' ? setMyTasksNav('Все') : setMyTasksNav('Новая')} style={nav === 'Новая' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                       <div className={`${styles.circle2} ${styles.blue}`}></div>
                       <p>Новая</p>
                   </div>
                   <div className={styles.legendWrapper} onClick={() => nav === 'В работе' ? setMyTasksNav('Все') : setMyTasksNav('В работе')}  style={nav === 'В работе' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                       <div className={`${styles.circle2} ${styles.orange}`}></div>
                       <p>В работе</p>
                   </div>
                   <div className={styles.legendWrapper} onClick={() => nav === 'Выполнено' ? setMyTasksNav('Все') : setMyTasksNav('Выполнено')}  style={nav === 'Выполнено' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                       <div className={`${styles.circle2} ${styles.green}`}></div>
                       <p>Выполнено</p>
                   </div>
                   <div className={styles.legendWrapper} onClick={() => nav === 'Брак' ? setMyTasksNav('Все') : setMyTasksNav('Брак')}  style={nav === 'Брак' ? {backgroundColor: 'rgba(0,0,0,.2)'} : null}>
                       <div className={`${styles.circle2} ${styles.red}`}></div>
                       <p>Брак</p>
                   </div>
               </div>
               <ul className={styles.searchItems} ref={list} style={{marginTop: 10}}>
                   {nav === 'Все' && myTasks.filter(el=>el[42].indexOf(customer) !== -1 ).map(el => <TaskItem task={el} key={el[0]}/>)}
                   {nav === 'Новая' && myTasks.filter(el=>el[42].indexOf(customer) !== -1 && el[18] === 'Новая').map(el => <TaskItem task={el} key={el[0]}/>)}
                   {nav === 'В работе' && myTasks.filter(el=>el[42].indexOf(customer) !== -1 && el[18] === 'В работе').map(el => <TaskItem task={el} key={el[0]}/>)}
                   {nav === 'Выполнено' && myTasks.filter(el=>el[42].indexOf(customer) !== -1 && (el[18] !== 'В работе' && el[18] !== 'Новая' && el[18] !== 'Не выезжали' && el[18] !== 'Брак')).map(el =><TaskItem task={el} key={el[0]}/>)}
                   {nav === 'Брак' && myTasks.filter(el=>el[42].indexOf(customer) !== -1 && (el[18] === 'Брак')).map(el => <TaskItem task={el} key={el[0]}/>)}
               </ul>
           </div>}


        </div>
    );
}



export default MyTasks;
