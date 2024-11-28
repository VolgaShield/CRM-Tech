import React, {useEffect, useState} from 'react';
import styles from "./MyTasksItem.module.scss";
import Close from '../../img/close.png'
import {getMyTask, showTaskData} from "../../state/myTask";
import Moment from "react-moment";
import {$historyStatus, getHistory} from "../../state/taskHistory";
import {useStore} from "effector-react";
import ReportWrapper from "../Search/ReportWrapper";
import {$user} from "../../state/user";
import Edit from '../../img/edit.png'
import Confirm from '../../img/check-mark.png'
import Inform from '../../img/info.png'
import History from '../../img/history.png'
import Folder from '../../img/folder.png'
import View from '../../img/view.png'
import Trash from '../../img/trashRed.png'
import Chat from '../../img/bubble-chat.png'
import Deffect from '../../img/back-arrow.png'
import Check from '../../img/check.png'
import {updateTask} from "../../actions/updateTask";
import ItemChat from "./ItemChat";
import {$commentsStatus, getComment} from "../../state/comments";
import Loader from "../Loader/Loader";
import HistoryItem from "./HistoryItem";
import HistoryBlock from "../History/History";
import Select from "react-select";


const ImgDrop = ({el, id, i, func}) => {
    const [show, setShow] = useState(false)
    return (
        <li>
            <div className={styles.photoDrop}> <p>Фото {i} </p> <div><img src={View} alt="" onClick={() => setShow(!show)}/><img src={Trash} alt="" onClick={func}/></div></div>
            {show ? <img className={styles.uploadImage} src={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${id}/${el}`} alt=""/> : null}
        </li>
    )
}

const options = [
    { value: 'Заявка', label: 'Заявка' },
    { value: 'Претензия', label: 'Претензия' },
    { value: 'СО', label: 'Снятие Объемов' },
    { value: 'Задача', label: 'Задача' },
    { value: 'Демонтаж', label: 'Демонтаж' },
    { value: 'Монтаж', label: 'Монтаж' },
    { value: 'Нет контрольного события', label: 'Нет контрольного события' }
]

const MyTaskItem = ({item}) => {
    const [loading, setLoading] = useState(false)

    const history = useStore($historyStatus);
    const [report, showReport] = useState(false);
    const user = useStore($user);
    const [form, setForm] = useState({
        name: item[2],
        address: item[4],
        desc: item[13],
        client: item[40],
        type: item[8],
        date: item[17],
        time: item[34],
        brak: item[43]
    })


    const comments = useStore($commentsStatus);

    const [edit, setEdit] = useState(false);
    const [nav, setNav] = useState('info');
    useEffect(() => {
        getComment(item[0])
        getHistory({id: item[0]})
    }, [])

    const timeCounter = () => {
        const deadline = item[34] * 60;

        const timeJob = ((item[9].substr(0,2) * 60) + +item[9].substr(3,2))


        function getTimeFromMins(mins) {
            let hours = Math.trunc(mins/60);
            let minutes = mins % 60;
            return `${hours < 9 ? '0'+hours : hours}:${minutes < 9 ? '0'+minutes : minutes}:00`;
        };

        if (deadline < timeJob) {
            return <div className={styles.taskItemInput}>
                <p className={styles.label}>Просрочена на: <span style={{fontWeight: 500, color: 'red', fontSize: 14}}>{getTimeFromMins(timeJob-deadline)}</span></p>


            </div>
        }
    }

    const confirmTask = () => {
        let answer = window.confirm('Принять задачу?');

        if (answer) {
            fetch(`https://volga24bot.com/kartoteka/api/tech/setConfirm.php?id=${item[0]}`)
                .then(res => res.json())
                .then(res => {
                    if (res === 1) {
                        alert('Задача подтверждена')
                        showTaskData(false);
                        getMyTask(user.ID)
                    }
                })
        }

    }


    const sendFiles = (files) => {
        setLoading(true)
        let formData = new FormData();

        for (let i = 0; i<files.length; i++) {

            formData.append([files[i].name], files[i])
        }

        formData.append("id", item[0])
        fetch('https://volga24bot.com/kartoteka/api/tech/Files.php',{

            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                if (res) {
                    showTaskData(res)
                    setLoading(false)
                }  else {
                    alert('Произошла ошибка')
                }

            })
    }

    const deleteFile = (fileName) => {

        const files = item[44].split(';');

        const index = files.indexOf(fileName)
        files.splice(index, 1)

        let formData = new FormData();


        formData.append("id", item[0])
        formData.append("item", fileName)
        formData.append("files", files.join(';'))
        fetch('https://volga24bot.com/kartoteka/api/tech/deleteFile.php',{

            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(res => res ? showTaskData(res) : alert('Произошла ошибка'))

    }

    return (
            <div className={styles.taskItemWrapper}>
                {loading ? <div className={styles.loaderWrapper}><Loader/></div> : null}
                <header><p>{item[8] === 'СО' ? 'Снятие Объемов' : item[8]}</p> <img src={Close} alt="" onClick={() => showTaskData(false)}/></header>
                <nav className={styles.Nav}>
                    <ul>
                        <li className={nav === 'info' ? styles.active : null} onClick={() => setNav('info')}>
                            <img src={Inform} alt=""/>
                        </li>
                        <li className={nav === 'files' ? styles.active : null} onClick={() => setNav('files')}>
                            <img src={Folder} alt=""/>

                        </li>
                        <li className={nav === 'history' ? styles.active : null} onClick={() => setNav('history')}>
                            <img src={History} alt=""/>

                        </li>
                        <li style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={nav === 'historyObj' ? styles.active : null} onClick={() => setNav('historyObj')}>
                            <p>История</p>
                        </li>
                        <li className={nav === 'chat' ? styles.active : null} onClick={() => setNav('chat')} style={{position: 'relative'}}>
                            <img src={Chat} alt=""/>
                            {comments.filter(el => el[6] === "0" && el[1] !== user.ID).length ? <p className={styles.countUnwrite}>{comments.filter(el => el[6] === "0" && el[1] !== user.ID).length}</p> : null}
                        </li>
                    </ul>
                </nav>
                {nav === 'historyObj' ? <HistoryBlock block={item[1]}/> : null}

                {nav === 'info' ? <div className={styles.taskItemBody}>

                    {edit ? <img src={Confirm} alt="" className={styles.edit} style={{borderColor: "#3F9257"}} onClick={() => {
                        updateTask(form, item[0])
                        item[2] = form.name
                        item[4] = form.address
                        item[13] = form.desc
                        item[40] = form.client
                        item[17] = form.date
                        item[43] = form.brak
                        item[8] = form.type
                        item[34] = form.time
                        setEdit(false)
                    }}/> : <img src={Edit} alt="" className={styles.edit} onClick={() => setEdit(true)}/>}
                    <div className={styles.dflex}>
                        <div className={styles.taskItemInput}>
                            <p className={styles.label}  >Статус</p>
                            <p style={item[18] === 'Брак' ? {color: "red"} : null} className={`${styles.status} ${item[18] === 'Новая' ? styles.redStatus : null} ${item[18] === 'В работе' ? styles.orangeStatus : null} ${item[18] !== 'Новая' && item[18] !== 'В работе' ? styles.blueStatus : null}`} >{item[18]}</p>

                        </div>
                        <div className={styles.taskItemInput}>
                            <p className={styles.label}  >Номер</p>
                            <p style={{fontWeight: 500}}>{item[47]}</p>

                        </div>
                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Вид задачи</p>
                        {edit ?  <Select options={options}  onChange={(e) => setForm(prevState => ({...prevState, type: e.value}))} defaultValue={form.type}/>:<p className={`${styles.status} `} >{item[8]}</p> }


                    </div>
                    {item[18] === 'Брак' ? <div className={styles.taskItemInput}>
                        <p className={styles.label}>Причина брака</p>
                        {edit ? <input type="text" value={form.brak} onChange={e => setForm(prevState => ({...prevState, brak: e.target.value}))}/>:<p className={`${styles.status} `} >{item[43]}</p> }


                    </div> : null}
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Ответственный</p>
                        <p>{item[42].split(' ')[0] } {item[42].split(' ')[1][0]}.{item[42].split(' ')[2][0]}   </p>

                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Исполнитель</p>
                        <p>{item[7].split(' ')[0] } {item[7].split(' ')[1][0]}.{item[7].split(' ')[2][0]}</p>
                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Название объекта</p>
                        {edit ? <input type="text" value={form.name} onChange={e => setForm(prevState => ({...prevState, name: e.target.value}))}/>:<p>{item[2]}</p> }

                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Адрес объекта</p>
                        {edit ? <input type="text" value={form.address} onChange={e => setForm(prevState => ({...prevState, address: e.target.value}))}/>: <p>{item[4]}</p>}

                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Дата выполнения</p>
                        {edit ? <input type="datetime-local" value={form.date} onChange={e => setForm(prevState => ({...prevState, date: e.target.value}))}/>: <p><Moment format="DD.MM.YY HH:mm">{item[17]}</Moment></p>}

                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Описание</p>

                        {edit ? <input type="text" value={form.desc} onChange={e => setForm(prevState => ({...prevState, desc: e.target.value}))}/>:<p>{item[13]}</p> }
                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Клиент</p>
                        {edit ? <input type="text" value={form.client} onChange={e => setForm(prevState => ({...prevState, client: e.target.value}))}/>:<p>{item[40]}</p> }

                    </div>
                    <div className={styles.taskItemInput}>
                        <p className={styles.label}>Время на работу</p>
                        <p>{item[34].indexOf('0.666') !== -1 ? '40 минут' : `${item[34]} ч.ч`}</p>

                    </div>
                    {timeCounter()}
                </div> : null}
                {nav === 'history' ? <div className={styles.processTracker}>
                    {/*<div className={`${styles.processItem} ${styles.activeProcess}`}>*/}
                    {/*<div className={styles.circle}></div>*/}
                    {/*<div>*/}
                    {/*<p>{'Поставлена '}</p>*/}
                    {/*<p style={{fontSize: 11, color: "grey"}}><Moment format={'DD.MM.YYYY HH:mm:ss'}>{history.Поставлена ? history.Поставлена[1] : item[17] }</Moment></p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={`${styles.processItem} ${history.view ? styles.activeProcess : null}`}>*/}
                    {/*<div className={styles.line}></div>*/}
                    {/*<div className={styles.circle}></div>*/}
                    {/*<div>*/}
                    {/*    <p>Прочитана</p>*/}
                    {/*    <p style={{fontSize: 11, color: "grey"}}>{history.view  ? <Moment format={'DD.MM.YYYY HH:mm:ss'}>{history.view[1]}</Moment> : null}</p>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={`${styles.processItem}`}>*/}
                    {/*    <div className={styles.line}></div>*/}
                    {/*    <div className={styles.circle}></div>*/}
                    {/*<div>*/}
                    {/*<p>Позвонил клиенту</p>*/}
                    {/*<p style={{fontSize: 11, color: "grey"}}>{history.callTo ? <Moment format={'DD.MM.YYYY HH:mm:ss'}>{history.callTo[1]}</Moment> : null}</p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={`${styles.processItem} ${history['В работе'] ? styles.activeProcess : null}`}>*/}
                    {/*<div className={styles.line}></div>*/}
                    {/*<div className={styles.circle}></div>*/}
                    {/*<div>*/}
                    {/*<p>В работе</p>*/}
                    {/*<p style={{fontSize: 11, color: "grey"}}>{history['В работе'] ? <Moment format={'DD.MM.YYYY HH:mm:ss'}>{history['В работе'][1]}</Moment> : null}</p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={`${styles.processItem} ${item[18] !== 'Новая' &&  item[18] !== 'В работе' ? styles.activeProcess : null} `}>*/}
                    {/*<div className={styles.line} style={{height: 80}}></div>*/}
                    {/*<div className={styles.circle}></div>*/}
                    {/*<div style={{display: "flex", alignItems: 'center'}}>*/}
                    {/*    <div style={{marginRight: 20}}>*/}
                    {/*        <p>Выполнено</p>*/}
                    {/*        <p style={{fontSize: 11, color: "grey"}}>{item[18] !== 'Новая' &&  item[18] !== 'В работе'  ? <Moment format={'DD.MM.YYYY HH:mm:ss'}>{item[6]}</Moment> : null}</p>*/}
                    {/*    </div>*/}
                    {/*    {item[18] !== 'Новая' &&  item[18] !== 'В работе' ? <button className={styles.raport} onClick={() => showReport(item)}>Посмотреть отчет</button> : null}*/}

                    {/*</div>*/}

                    {/*</div>*/}
                    <HistoryItem title={'Поставлена'} active={history.Поставлена ? history.Поставлена : []} />
                    <HistoryItem title={'Прочитана'} withLine={true} active={history.view ? history.view : []}/>
                    <HistoryItem title={'Созвонился'} withLine={true} active={history.callTO ? history.callTO : []} failed={!!history['В работе']}/>
                    {history.ChangeTech ? <HistoryItem title={`Сменили исполнителя на ${history.ChangeTech[3]}`} withLine={true} active={history.ChangeTech}/> : null}
                    <HistoryItem title={'Начал задачу'} withLine={true} active={item[5] ? [0, item[5]]  : []}/>
                    <HistoryItem title={'Завершил задачу'} withLine={true} active={item[18] !== 'Новая' && item[18] !== 'В работе' ? [0, item[6]] : []}/>
                    {history.Брак ? <>
                        <HistoryItem title={'Отправлена в брак'} withLine={true} active={item[46] ? [0, item[46]]  : []}/>
                        <HistoryItem title={'Брак исправлен'} withLine={true} active={item[49] ? new Date(item[46]).getTime() > new Date(item[49]).getTime() ? []: [0, item[49]]  : []}/>
                    </> : null}

                    <div>
                        {item[18] !== 'Новая' &&  item[18] !== 'В работе' ? <button className={styles.raport} onClick={() => showReport(item)}>Посмотреть отчет</button> : null}
                    </div>
                    </div> : null}
                {nav === 'files' ? <div className={styles.filesWrapper}>
                    <ul>
                        {item[44].split(';').reverse().map((el, i) => {
                            if (el.length > 1 ) {
                                const extend = el.split('.')[1];
                                if (extend === 'jpeg' || extend === 'png' || extend === 'gif' || extend === 'bmp' || extend === 'jpg' || extend === 'tiff' || extend === 'jfif') {
                                    return <ImgDrop key={el} i={i+1} el={el} id={item[0]} func={() => deleteFile(el)}/>
                                } else {
                                    return <li key={el}><p className={styles.photoDrop}><a target={'_blank'} href={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`} download={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`}>{el.replace(/_/gi, ' ').substr(0, 30)}...</a> <div><img onClick={() => deleteFile(el)} src={Trash} alt=""/></div></p></li>
                                }
                            }

                        })}
                    </ul>  <label  className={styles.filesLabel}>
                        <input type="file" multiple onChange={(e) => sendFiles(e.target.files)}/>
                        {'Загрузить файлы'}
                    </label>
                </div> : null}
                {nav === 'chat' ? <ItemChat item={item}/> : null}
                   {/* {item[18] !== 'Новая' &&  item[18] !== 'В работе' ? <button className={`${styles.brackButton} ${styles.finishButton}`}>Брак (кнопка пока не работает, разрабатываю систему брака)</button> : null}*/}
                   {/*{item[18] !== 'Новая' &&  item[18] !== 'В работе' ? <button className={styles.finishButton} onClick={() => confirmTask()}>Принять работу</button> : null}*/}
                {report ? <ReportWrapper req={item} func={() => showReport(false)}/> : null}

                {nav !== 'chat' ? <footer className={styles.footerNav}>
                    <ul>
                        <li className={nav === 'info' ? styles.active : null} onClick={() => {
                            const answer = window.confirm('Удалить задачу?')

                            if (answer) {
                                fetch(`https://volga24bot.com/kartoteka/api/tech/deleteTask.php?id=${item[0]}`)
                                    .then(res => res.json())
                                    .then(res => {
                                        if (res === 'success') {
                                            showTaskData(false);
                                            getMyTask(user.ID)
                                        } else {
                                            alert('Произошла ошибка!')
                                        }
                                    })
                            }
                        }}>
                            <img src={Trash} alt=""/>
                        </li>
                        {item[18] !== 'Брак' ? <li onClick={() => {
                            const answer = window.prompt('Для смены статуса на "Брак" оставьте комментарий!')

                            fetch(`https://volga24bot.com/kartoteka/api/tech/deffectTask.php?id=${item[0]}&comment=${answer}`)
                                .then(res => res.json())
                                .then(res => {
                                    if (res) {

                                        item[46] = res
                                        item[43] = answer
                                        item[18] = 'Брак'
                                        setNav('files')
                                        setNav('history')
                                    } else {
                                        alert('Произошла ошибка!')
                                    }
                                })

                        }}>
                            <img src={Deffect} alt=""/>
                        </li> : null}
                        {item[18] !== 'Новая' &&  item[18] !== 'В работе' &&  item[18] !== 'Брак' ? <li className={nav === 'history' ? styles.active : null} onClick={() => confirmTask()}>
                            <img src={Check} alt=""/>
                        </li> : <li className={nav === 'history' ? styles.active : null} >
                        </li>}

                    </ul>
                </footer> : null}
            </div>
    );
}



export default MyTaskItem;
