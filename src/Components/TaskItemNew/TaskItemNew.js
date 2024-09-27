
//IMPORTS
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';

//Libraries
import { useStore } from "effector-react";
import moment from 'moment'
import Select from "react-select";

//Components
import ItemChat from "./ItemChat";
import Loader from "../Loader/Loader";
import HistoryItem from "./HistoryItem";
import HistoryBlock from "../History/History";
import DopInfo from "./DopInfo/DopInfo";
import MapContainer from '../Map/MapHistory';
import WordExport from '../ExportToDoc/ExportToDoc'

//State/Store
import { $user, $depStatus } from "../../state/user";
import { getMyTask, showTaskData } from "../../state/myTask";
import { $historyStatus, getHistory } from "../../state/taskHistory";
import { $commentsStatus, getComment } from "../../state/comments";
import { setShowTask } from "../../state/showTask";
import { $customerStatus, getCustomer, setCustomer } from "../../state/getCustomerByPhone";
import { $usersStatus } from "../../state/getUsers";
import { updateHistory } from "../../store/task";
import { $important, setImportant } from "../../store/importants";

//Actions
import { updateTask } from "../../actions/updateTask";
import { setHistory } from "../../actions/setHistory";

//Utils
import { filterTaskCust } from "../../utils/filterTaskCust";
import { getLastName } from "../../utils/getLastName";
import { getShortName } from '../../utils/getShortName';

//Wrappers
import ReportWrapper from "../Search/ReportWrapper";

//IMG
import Close from '../../img/close.png'
import Edit from '../../img/edit.png'
import Confirm from '../../img/check-mark.png'
import Inform from '../../img/info.png'
import History from '../../img/history.png'
import Folder from '../../img/folder.png'
import View from '../../img/view.png'
import Trash from '../../img/trashRed.png'
import Chat from '../../img/bubble-chat.png'
import BlockInfo from '../../img/data-complexity.png'
import Back from "../../img/back.png";
import Deffect from '../../img/back-arrow.png'
import Check from '../../img/check.png'
import ExclamationMark from '../../img/ExclamationMark.png'
import Suitcase from '../../img/Suitcase.png'

//CSS
import styles from "./MyTasksItem.module.scss";

const PopUp = ({ data, func }) => {

  useEffect(() => {
    if (data.OBJ.length === 1) {

      const cust = data.CUST.filter(el => el.ObjectID === data.OBJ[0].ObjectID)[0]
      const ObjNum = +data.OBJ[0].ObjectNumber;

      func(data.OBJ[0].Name, data.OBJ[0].Address, cust.ObjCustName, ObjNum.toString(16))
      setCustomer([])
    }
  }, [])

  return (
    data.OBJ.length === 0 ? null : <div className={styles.popUp}>
      <header>
        <p>Выберите объект:</p>
        <img src={Back} alt="" onClick={() => setCustomer([])} />
      </header>
      <ul>
        <li style={{ fontWeight: 500, fontSize: 14, padding: '15``px 20px' }} onClick={() => {
          func()
          setCustomer([])
        }}><p className={styles.counter}>1</p> Без объекта</li>
        {data.OBJ.map((el, i) => <li key={el.ObjectID} onClick={() => {
          const cust = data.CUST.filter(el2 => el2.ObjectID === el.ObjectID)[0]
          const ObjNum = +el.ObjectNumber;

          func(el.Name, el.Address, cust.ObjCustName, ObjNum.toString(16))
          setCustomer([])
        }}><p className={styles.counter}>{i + 2}</p> <div><p>{el.Name}</p> <p>{el.Address}</p></div></li>)}
      </ul>
    </div>
  )
}

const ImgDrop = ({ el, id, i, func }) => {
  const user = useStore($user);
  const [show, setShow] = useState(false)
  return (
    <li>
      <div className={styles.photoDrop}> <p>Фото {i} </p> <div><img src={View} alt="" onClick={() => setShow(!show)} /> {user.ID === el[37] && <img src={Trash} alt="" onClick={func} />}</div></div>
      {show ? <img className={styles.uploadImage} src={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${id}/${el}`} alt="" /> : null}
    </li>
  )
}

/**
 * Массив типов заявок.
 * Пример:
 * ```js
 * [
 *  ...
 *  {value: 'Демонтаж', label: 'Демонтаж'}
 *  ...
 * ]
 * ```
 */
const taskTypesArray = [
  { value: 'Заявка', label: 'Заявка' },
  { value: 'Претензия', label: 'Претензия' },
  { value: 'СО', label: 'Снятие Объемов' },
  { value: 'ТО', label: 'Техническое Обслуживание' },
  { value: 'Демонтаж', label: 'Демонтаж' },
  { value: 'Монтаж', label: 'Монтаж' },
  { value: 'Подключение', label: 'Подключение' },
  { value: 'Нет контрольного события', label: 'Нет контрольного события' },

  { value: 'Снятие/Постановка', label: 'Снятие/Постановка' },
  { value: 'Шлейф', label: 'Шлейф' },
  { value: 'КТС', label: 'КТС' },
  { value: 'Ключ', label: 'Ключ' },
  { value: '220', label: '220' },
]

/**
 * Фамилии Техников, которые могут просматривать заявки.
 * При открытии заявки в техслужбе данным техников она будет считаться просмотренной им.
 */
const fioTech = ['Галкин', 'Косарев', 'Орлов', 'Пономарев', 'Трусов']

/**
 * Отображает окно информации о заявке при её выборе на странице выбора заявок
 * 
 * 
 * @param {Заявка} item
 * @returns 
 */
const TaskItemNew = ({ item }) => {

  /** Список Регионов (Черный Яр, Элиста и т.д.)*/
  const deps = useStore($usersStatus);
  /** Список Техников отдела (в зависимости от выбранного региона)*/
  const dep = useStore($depStatus);
  /** Информация о пользователе */
  const user = useStore($user);

  /**Краткие данные о каждом технике. Пример: 
   * ```js
   * [
      {
          "value": "Трусов Егор Владимирович",
          "label": "Трусов Е.В."
      },
      ...
    ]
   * ``` */
  const techsData = dep
    .filter(el => el.WORK_POSITION && el.WORK_POSITION !== 'Водитель' && !(el.WORK_POSITION.includes('Руководитель'))) // из-за этого условия не работает & !(el.WORK_POSITION.includes('Начальник'))
    .map(el => ({
      value: `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`,
      label: `${el.LAST_NAME} ${el.NAME[0]}.${el.SECOND_NAME[0]}.`
    }));

  /**ID Пользователей Битрикс, которым разрешен доступ на редактирование заявок */
  const admins = [item[37], '1', '11', '33', '29', '23', '317', '211', '109', '3745', '3789', '3707'];
  /** ID Пользователей Битрикс, которым доступен экспорт форм */
  const adminsForExportForms = ['1', '33', '39', '317', '3707',  '3759', '3745', '3763', '3789']
  //Информация о заявке
  const [form, setForm] = useState({
    name: item[2],
    address: item[4],
    desc: item[13],
    client: item[40],
    type: item[8],
    date: item[17],
    time: item[34],
    brak: item[43],
    executor: item[55]
  }) //Общая Форма
  const [history2, setHistory2] = useState([]); //Массив с историей действией по заявке (поле historyJSON)
  const important = useStore($important);
  const comments = useStore($commentsStatus);
  const customer = useStore($customerStatus);

  //Навигация
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false); //Флаг для выбора режима редактирования
  const [report, showReport] = useState(false) //Флаг для открытия окна просмортра отчета о закрытии заявки в истории
  const [nav, setNav] = useState('info'); //Отвечает за навигацию между экранами

  //TODO: Разобраться, что делает эта функция
  useEffect(() => {
    getComment(item[0]);
    const phone = item[40].split('-')[0];
    if (edit && (!form.name.length || !form.address.length) && phone.length) {
      getCustomer(phone)
    }
    if (item[52] && JSON.parse(item[52])) {
      setHistory2(JSON.parse(item[52]).flat(1))
    }
  }, [edit, nav])

  //DEBUG LOG
  // useEffect(() => {
  //   console.log({
  //     "TaskItemNew": {
  //       "item": item, "dep": dep, "deps": deps, "techsData": techsData, "admins": admins,
  //       "nav": nav, "edit": edit,
  //       "history2": history, "important": important, "comments": comments, "customer": customer
  //     }
  //   })
  // }, [nav])

  //Если техник читает свою же собственную заявку, то записать в historyJSON то, что он её прочитал
  useEffect(() => {
    if (item[50] === '0000-00-00 00:00:00') {
      if (fioTech.includes(user.LAST_NAME)) {
        setHistory(item[0], 'view', '', `${user.LAST_NAME} ${user.NAME} ${user.SECOND_NAME}`, (a) => updateHistory(a));
        fetch(`https://volga24bot.com/kartoteka/api/tech/setView.php?id=${item[0]}`).then(res => res.json()).then(res => {
          setImportant([...important, item])
        })
      }
    }
  }, [])

  //Костыль?
  useEffect(() => {
    item[8] = form.type;
    item[7] = form.executor;
    item[55] = form.executor;
  }, [form])

  const timeCounter = () => {
    const deadline = item[34] * 60;

    const timeJob = ((item[9].substr(0, 2) * 60) + +item[9].substr(3, 2))

    function getTimeFromMins(mins) {
      let hours = Math.trunc(mins / 60);
      let minutes = mins % 60;
      return `${hours < 9 ? '0' + hours : hours}:${minutes < 9 ? '0' + minutes : minutes}:00`;
    };

    if (deadline < timeJob) {
      return <div className={styles.taskItemInput}>
        <p className={styles.label}>Просрочена на: <span style={{ fontWeight: 500, color: 'red', fontSize: 14 }}>{getTimeFromMins(timeJob - deadline)}</span></p>
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
            setShowTask(false);
            getMyTask(user.ID)
          }
        })
    }

  }

  const sendFiles = (files) => {
    setLoading(true)
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {

      formData.append([files[i].name], files[i])
    }

    formData.append("id", item[0])
    fetch('https://volga24bot.com/kartoteka/api/tech/Files.php', {

      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res) {
          setShowTask(res)
          setLoading(false)
        } else {
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
    fetch('https://volga24bot.com/kartoteka/api/tech/deleteFile.php', {

      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => res ? setShowTask(res) : alert('Произошла ошибка'))

  }

  const daysOverdue = useMemo(() => {
    console.log(item)
    const taskDate = Date.parse(item[17].replace(' ', 'T'));
    return Math.ceil(Math.abs(new Date().setHours(0, 0, 0, 0) - taskDate) / (1000 * 3600 * 24)) - 1;
  }, [item])

  //console.log(history2)

  const onClickRetryTask = () => {
    const prob = prompt('Введите причину');
    if (!prob) return;

    let formData = new FormData();
    formData.append('id', item[0]);
    formData.append('type', 'retry');
    formData.append('value', prob);
    formData.append('user', `${user.LAST_NAME} ${user.NAME} ${user.SECOND_NAME}`);

    fetch('https://volga24bot.com/kartoteka/api/tech/retryTask.php', {
      method: "POST",
      body: formData
    })
      .then(() => alert('Успешно возобновлена, закройте заявку для обновления.'))
  }

  const [newDate, setNewDate] = useState('');

  const onClickNewPlaneTask = () => {
    if (!newDate) return;
    const data = new FormData();
    data.append('id', item[0]);
    data.append('date', newDate.split('T')[0]);
    data.append('time', newDate.split('T')[1]);
    fetch('https://volga24bot.com/kartoteka/api/tech/planing/newPlane.php', {
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then(res => res === 'success' ? alert("Задача успешно перепланирована!") : null);
  }

  return (
    <div className={styles.taskItemWrapper}>

      {/* Хэдэр и Меню Навигации */}
      {loading ? <div className={styles.loaderWrapper}><Loader /></div> : null}
      <header><p>{item[8] === 'СО' ? 'Снятие Объемов' : item[8]} {item[47]}</p> <img src={Close} alt="" onClick={() => setShowTask(false)} /> </header>
      <nav className={styles.Nav}>
        <ul>
          <li className={nav === 'info' ? styles.active : null} onClick={() => setNav('info')}>
            <img src={Inform} alt="" />
          </li>
          <li className={nav === 'blockInfo' ? styles.active : null} onClick={() => setNav('blockInfo')}>
            <img src={BlockInfo} alt="" />
          </li>
          <li className={nav === 'files' ? styles.active : null} onClick={() => setNav('files')}>
            <img src={Folder} alt="" />

          </li>
          <li className={nav === 'history' ? styles.active : null} onClick={() => setNav('history')}>
            <img src={History} alt="" />
          </li>


          {history2.filter(el => el.hasOwnProperty('location')).filter(el => el.location !== null && el.location !== "загрузка.../загрузка...").length > 0 ? <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={nav === 'historyLocation' ? styles.active : null} onClick={() => setNav('historyLocation')}>
            <p>Карта</p>
          </li> : null}

          <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={nav === 'historyObj' ? styles.active : null} onClick={() => setNav('historyObj')}>
            <p>История</p>
          </li>

          {<li className={nav === 'chat' ? styles.active : null} onClick={() => setNav('chat')} style={{ position: 'relative' }}>
            <img src={Chat} alt="" />
            {comments.filter(el => el[6] === "0" && el[1] !== user.ID).length ? <p className={styles.countUnwrite}>{comments.filter(el => el[6] === "0" && el[1] !== user.ID).length}</p> : null}
          </li>}
        </ul>
      </nav>

      {nav === 'info' ? <div className={styles.taskItemBody}>

        {edit ? <img src={Confirm} alt="" className={styles.edit} style={{ borderColor: "#3F9257" }} onClick={() => {
          updateTask(form, item, user)
          item[2] = form.name
          item[4] = form.address
          item[13] = form.desc
          item[40] = form.client
          item[17] = form.date
          item[43] = form.brak
          item[8] = form.type
          item[34] = form.time
          item[55] = form.executor
          setEdit(false)
        }} /> : (admins.includes(user.ID)) ? <img src={Edit} alt="" className={styles.edit} onClick={() => setEdit(true)} /> : null}
        <div className={styles.dflex}>
          <div className={styles.taskItemInput}>
            <p className={styles.label}  >Статус</p>
            <p style={item[18] === 'Брак' ? { color: "red" } : null} className={`${styles.status} ${item[18] === 'Новая' ? styles.redStatus : null} ${item[18] === 'В пути' ? styles.orangeStatus : null} ${item[18] === 'В работе' ? styles.yellowStatus : null} ${item[18] !== 'Новая' && item[18] !== 'В пути' && item[18] !== 'В работе' ? styles.blueStatus : null}`} >
              {item[18]}
              <span>{daysOverdue}</span>
              {(admins.includes(user.ID)) ? item[18] !== 'Новая' && item[18] !== 'В работе' ? <button className={styles.retryTask} onClick={onClickRetryTask}>Возобновить</button> : null : null}
              {(admins.includes(user.ID)) ? item[18] === 'Новая' || item[18] === 'Брак' ?
                <span>
                  Дата
                  <input style={{ width: '160px' }} type="datetime-local" value={newDate} onChange={(e) => { setNewDate(e.target.value); }} />
                  <button className={styles.retryTask} onClick={onClickNewPlaneTask}>Планировать</button>
                </span>
                : null : null}
            </p>

          </div>
          <div className={styles.taskItemInput}>
            <div>
              <p className={styles.label}  >Номер</p>
              <p style={{ fontWeight: 500 }}>{item[47]}</p>
            </div>
            {item[17] ? <div>
              <p className={styles.label}  >Дата Создания</p>
              <p style={{ fontWeight: 500 }}>{moment(item[17]).format('DD.MM.YY HH:mm')}</p>
            </div> : null}
            {item[6] ? <div>
              <p className={styles.label}  >Дата Выполнения</p>
              <p style={{ fontWeight: 500 }}>{moment(item[6]).format('DD.MM.YY HH:mm')}</p>
            </div> : null}
            {/* Для выгрузки названия и адреса в Word документ */}
            {(adminsForExportForms.includes(user.ID)) ? <>
            <WordExport
                task={item}
                form='form_1.docx'
                formName='Форма 1'
              />
              <br /> <br />
              <WordExport task={item} form='form_2.docx' formName='Форма 2' /></> : null}
            
          </div>
        </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Вид задачи</p>
          {edit ?
            <select onChange={(e) => setForm(prevState => ({ ...prevState, type: e.target.value }))} placeholder={'Введите заявку'}>
              {taskTypesArray.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
              <option value={item[8].length ? item[8] : ""} selected disabled hidden>{item[8].length ? item[8] : "Общая (Без Исполнителя)"}</option>
            </select>
            : <p className={`${styles.status} `} >{item[8]}</p>}
        </div>
        {item[18] === 'Брак' ? <div className={styles.taskItemInput}>
          <p className={styles.label}>Причина брака</p>
          {edit ? <input type="text" value={form.brak} onChange={e => setForm(prevState => ({ ...prevState, brak: e.target.value }))} /> : <p className={`${styles.status} `} >{item[43]}</p>}
        </div> : null}
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Ответственный</p>
          {<p>{deps.find(el => +el.DEP === filterTaskCust(item[4]))?.CHIEF.LAST_NAME}</p>}
        </div>
        <div className={styles.taskItemInput}>
        <p className={styles.label}>Исполнитель</p>
        {edit ? (
          <select onChange={(e) => setForm(prevState => ({ ...prevState, executor: e.target.value }))}>
            <option 
              value={item[7].length ? getShortName(item[7]) : item[55] ? getShortName(item[55]) : ""} 
              selected 
              disabled 
              hidden>
              {item[7].length ? getShortName(item[7]) : item[55].length ? getShortName(item[55]) : "Общая (Без Исполнителя)"}
            </option>
            {[
              // { value: 'Закаблуков Денис Владимирович', label: 'Закаблуков Д.В.' },
              { value: 'Галкин Сергей Александрович', label: 'Галкин С.А.' },
              { value: 'Косарев Александр Сергеевич', label: 'Косарев А.С.' },
              { value: 'Орлов Евгений Сергеевич', label: 'Орлов Е.С.' },
              { value: 'Пономарев Сергей Владимирович', label: 'Пономарев С.В.' },
              { value: 'Трусов Егор Владимирович', label: 'Трусов Е.В.' },
              { value: '', label: 'Общая (Нет исполнителя)' }
            ].map(el => (
              <option value={el.value} key={el.value}>{el.label}</option>
            ))}
          </select>
        ) : (
          <p>{item[7].length ? getLastName(item[7]) : item[55].length ? getLastName(item[55]) : 'Не назначен'}</p>
        )}
      </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Название объекта</p>
          {edit ? <input type="text" value={form.name} onChange={e => setForm(prevState => ({ ...prevState, name: e.target.value }))} /> : <p>{item[2]}</p>}
        </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Адрес объекта</p>
          {edit ? <input type="text" value={form.address} onChange={e => setForm(prevState => ({ ...prevState, address: e.target.value }))} /> : <p>{item[4]}</p>}
        </div>
        {/*<div className={styles.taskItemInput}>*/}
        {/*    <p className={styles.label}>Срок исполнения</p>*/}
        {/*    {edit ? <input type="datetime-local" value={form.date} onChange={e => setForm(prevState => ({...prevState, date: e.target.value}))}/>: <p><Moment format="DD.MM.YY HH:mm">{item[17]}</Moment></p>}*/}
        {/*</div>*/}
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Описание</p>
          {edit ? <textarea style={{ width: '100%', height: 100 }} value={form.desc} onChange={e => setForm(prevState => ({ ...prevState, desc: e.target.value }))} /> : <p>{item[13]}</p>}
        </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Клиент</p>
          {edit ? <input type="text" value={form.client} onChange={e => setForm(prevState => ({ ...prevState, client: e.target.value }))} /> : <p>{item[40]}</p>}
        </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Создатель задачи</p>
          <p>{item[38]}</p>
        </div>
        <div className={styles.taskItemInput}>
          <p className={styles.label}>Время на работу</p>
          {edit ? <input type="number" value={form.time} onChange={e => setForm(prevState => ({ ...prevState, time: e.target.value }))} /> : <p>{item[34].indexOf('0.666') !== -1 ? '40 минут' : `${item[34]} ч.ч`}</p>}
        </div>
        {timeCounter()}
        {item[58] ? <div className={styles.taskItemInput}>
          <p className={styles.label}>Планирование</p>
          <p> {item[58] === 'to' ? 'до' : null} {item[58] === 'from' ? 'после' : null} {item[57] !== '07:00' ? `${moment(item[56]).format('DD.MM')} ${item[57]}` : `${moment(item[56]).format('DD.MM')}`}</p>
        </div> : null}
      </div> : null}

      {nav === 'historyObj' ? <HistoryBlock block={item[1]} address={item[4]} setInfo={() => setNav('info')} />
        : null}

      {nav === 'history' ? <div className={styles.processTracker}>

        {report ? <ReportWrapper req={item} func={() => showReport(false)} />
          : null}

        <HistoryItem title={'Поставлена'} active={[0, new Date(item[17]).getTime() <= new Date(item[51]).getTime() ? item[17] !== '0000-00-00 00:00:00' ? item[17] : item[51] : item[51] !== '0000-00-00 00:00:00' ? item[51] : item[17]]} />
        <div className={styles.historyWrapper}>
          {history2.filter(el => el.type === 'view').length === 0 && <HistoryItem title={'Прочитана'} withLine={true} active={[]} />}
          {history2.map(el => {
            let type = '';

            if (el.type === 'call') {
              type = 'Созвонился'
            } else if (el.type === 'start') {
              type = 'В работе'
            } else if (el.type === 'comment') {
              type = `Примечание от ${el.user.split(' ')[0]}`
            } else if (el.type === 'finish') {
              type = 'Завершил работу'
            } else if (el.type === 'changeTech') {
              type = `Смена исполнителя`
            } else if (el.type === 'view') {
              type = `Прочитана`
            } else if (el.type === 'retry') {
              type = 'Возобновлена'
            } else if (el.type === 'myTechCreate') {
              type = 'Создана заявка MyTech'
            } else if (el.type === 'moving') {
              type = 'В пути'
            }

            if (el.type === 'view') {
              return <>
                <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.type !== 'myTechCreate' ? el.value : ''} />
                {history2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]} />}
              </>
            } else if (el.type !== 'deffect') {
              return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.type !== 'myTechCreate' ? el.value : ''} comm={item[64]} />
            }

          })}
          {history2.filter(el => el.type === 'deffect').length === 1 && <HistoryItem title={'Брак'} withLine={true} active={[0, history2.filter(el => el.type === 'deffect')[0].date]} activeText={history2.filter(el => el.type === 'deffect')[0].value} failed={true} />}
          {history2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]} />}
          {history2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]} />}
          {item[18] !== 'Новая' && item[18] !== 'В работе' && (item[6] || item[15] || item[12]) ? <button className={styles.raport} onClick={() => showReport(item)}>Посмотреть отчет</button> : null}
        </div>

        {/*{history2.map(el2 => {*/}
        {/*    return*/}

        {/*        {el2.map(el => {*/}
        {/*            let type = '';*/}

        {/*            if (el.type === 'call') {*/}
        {/*                type = 'Созвонился'*/}
        {/*            } else if (el.type === 'start') {*/}
        {/*                type = 'В работе'*/}
        {/*            } else if (el.type === 'comment') {*/}
        {/*                type = `Примечание от ${el.user.split(' ')[0]}`*/}
        {/*            }  else if (el.type === 'finish') {*/}
        {/*                type = 'Завершил работу'*/}
        {/*            } else if (el.type === 'changeTech') {*/}
        {/*                type = `Смена исполнителя`*/}
        {/*            } else if (el.type === 'view') {*/}
        {/*                type = `Прочитана`*/}
        {/*            }*/}

        {/*            if (el.type === 'view') {*/}
        {/*                return <>*/}
        {/*                    <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}
        {/*                    {el2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
        {/*                </>*/}
        {/*            } else if (el.type !== 'deffect') {*/}
        {/*                return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}

        {/*            }*/}

        {/*        })}*/}

        {/*        {el2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]}/>}*/}
        {/*        {el2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]}/>}*/}
        {/*        {el2.filter(el => el.type === 'deffect').length === 1 && <HistoryItem title={'Брак'} withLine={true} active={[0, el2.filter(el => el.type === 'deffect')[0].date]} activeText={el2.filter(el => el.type === 'deffect')[0].value} failed={true}/>}*/}

        {/*})}*/}



        {/*</>*/}

        {/*{history2.filter(el => el.type === 'view').length === 0 && <HistoryItem title={'Прочитана'} withLine={true} active={[]}/>}*/}
        {/*{history2.length === 0 &&  <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
        {/*{history2.map(el => {*/}
        {/*    let type = '';*/}

        {/*    if (el.type === 'call') {*/}
        {/*        type = 'Созвонился'*/}
        {/*    } else if (el.type === 'start') {*/}
        {/*        type = 'В работе'*/}
        {/*    } else if (el.type === 'comment') {*/}
        {/*        type = `Примечание от ${el.user.split(' ')[0]}`*/}
        {/*    }  else if (el.type === 'finish') {*/}
        {/*        type = 'Завершил работу'*/}
        {/*    } else if (el.type === 'changeTech') {*/}
        {/*        type = `Смена исполнителя`*/}
        {/*    } else if (el.type === 'view') {*/}
        {/*        type = `Прочитана`*/}
        {/*    }*/}
        {/*    if (type === 'Прочитана') {*/}
        {/*        return <>*/}
        {/*            <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}
        {/*            {history2.filter(el => el.type === 'call').length === 0 && <HistoryItem title={'Созвонился'} withLine={true} active={[]}/>}*/}
        {/*        </>*/}
        {/*    } else {*/}
        {/*        return <HistoryItem title={type} withLine={true} active={[0, el.date]} activeText={el.value}/>*/}

        {/*    }*/}
        {/*})}*/}

        {/*{history2.filter(el => el.type === 'start').length === 0 && <HistoryItem title={'В работе'} withLine={true} active={[]}/>}*/}
        {/*{history2.filter(el => el.type === 'finish').length === 0 && <HistoryItem title={'Завершил работу'} withLine={true} active={[]}/>}*/}

      </div> : null}

      {nav === 'historyLocation' ? <MapContainer items={history2} nav={"req"} user={user} />
        : null}

      {nav === 'blockInfo' ? item[1] !== '0' ? <DopInfo num={item[1]} /> : <p style={{ textAlign: "center" }}>В задаче нет номера объекта!</p>
        : null}

      {nav === 'files' ? <div className={styles.filesWrapper}>
        <ul>
          {item[44].split(';').reverse().map((el, i) => {
            if (el.length > 1) {
              const extend = el.split('.')[1];
              if (extend === 'jpeg' || extend === 'png' || extend === 'gif' || extend === 'bmp' || extend === 'jpg' || extend === 'tiff' || extend === 'jfif') {
                return <ImgDrop key={el} i={i + 1} el={el} id={item[0]} func={() => deleteFile(el)} />
              } else {
                return <li key={el}><p className={styles.photoDrop}><a target={'_blank'} href={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`} download={`https://volga24bot.com/kartoteka/api/tech/taskFiles/${item[0]}/${el}`}>{el.replace(/_/gi, ' ').substr(0, 30)}...</a> <div>{user.ID === el[37] && <img onClick={() => deleteFile(el)} src={Trash} alt="" />}</div></p></li>
              }
            }

          })}
        </ul>  {(admins.includes(user.ID)) ? <label className={styles.filesLabel}>
          <input type="file" multiple onChange={(e) => sendFiles(e.target.files)} />
          {'Загрузить файлы'}
        </label> : null}
      </div> : null}

      {nav === 'chat' ? <ItemChat item={item} />
        : null}

      {nav !== 'chat' && nav !== 'historyLocation' && (admins.includes(user.ID)) ? <footer className={styles.footerNav}>
        <ul>
          <li className={nav === 'info' ? styles.active : null} style={{ background: 'white' }} onClick={() => {
            const answer = window.confirm('Удалить задачу?')

            if (answer) {
              fetch(`https://volga24bot.com/kartoteka/api/tech/deleteTask.php?id=${item[0]}`)
                .then(res => res.json())
                .then(res => {
                  if (res === 'success') {
                    setShowTask(false);
                    getMyTask(user.ID)
                  } else {
                    alert('Произошла ошибка!')
                  }
                })
            }
          }}>
            <p style={{ color: "red", fontWeight: "bold", textShadow: "0.5px 0.5px 0.5px black" }}>Удалить</p>
            <img src={Trash} alt="" />
          </li>
          {item[18] !== 'Брак' ? <li onClick={() => {
            const answer = window.prompt('Для смены статуса на "Брак" оставьте комментарий!')
            setLoading(true)
            fetch(`https://volga24bot.com/kartoteka/api/tech/deffectTask.php?id=${item[0]}&comment=${answer}`)
              .then(res => res.json())
              .then(res => {
                setLoading(false)
                if (res) {
                  setHistory2(res)
                } else {
                  alert('Произошла ошибка!')
                }
              })

          }}>
            <p style={{ color: "chocolate", fontWeight: "bold", textShadow: "0.5px 0.5px 0.5px black" }}>В Брак</p>
            <img src={ExclamationMark} alt="" />
          </li> : null}
          <li className={nav === 'history' ? styles.active : null} onClick={() => confirmTask()}>
            <p style={{ color: "Green", fontWeight: "bold", textShadow: "0.5px 0.5px 0.5px black" }}>В Работу</p>
            <img src={Suitcase} alt="" />
          </li>

        </ul>
      </footer>
        : null}

      {customer.OBJ && customer !== 'loading' ? <PopUp data={customer} func={(a = '', b = '', c = '', d = '') => setForm(prevState => ({ ...prevState, name: a, address: b, clientFio: c, objNum: d }))} /> : null}

      {customer === 'loading' ? <Loader /> : null}

    </div>
  );
}


export default TaskItemNew;
