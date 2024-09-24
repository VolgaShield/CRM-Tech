import React from 'react';
import styles from './EquipmentPopUp.module.scss'
import Close from '../../img/close.png'
import { $user } from "../../state/user";
import { $depStatus } from "../../state/user";
import { useStore } from "effector-react";
import { createEquipment } from "../../actions/CreateEquipment";
import { setShowTask } from "../../state/showTask";
import { getAllByAltText } from "@testing-library/react";
import { useState } from 'react';
import { editEquipment } from '../../actions/EditEquipment';

import { setEquipmentHistory } from '../../actions/setEquipmentHistory';

import { $allReqStatus, getAllReq } from '../../state';

import { MdSell, MdOutlineMonetizationOn, MdAttachment, MdAutoAwesomeMotion, MdOutlineLooksOne, MdOutlineLooksTwo, MdHourglassDisabled } from "react-icons/md";


const EquipmentPopUp = ({ method, close, item }) => {

    const user = useStore($user);
    const dep = useStore($depStatus);
    const tasks = useStore($allReqStatus);

    const user_name = user.NAME + " " + user.LAST_NAME + " " + user.SECOND_NAME;

    const [selectedStatus, setSelectedStatus] = useState(null);

    const [issueMethod, setIssueMethod] = useState("");
    const [noBlockNumberCheck, setNoBlockNumberCheck] = useState(true);

    const [showExtraInfo, setShowExtraInfo] = useState([]);

    const [tasksFilter, setTasksFilter] = useState({
        id: '',
        // techName: '',
        dateCreate: '',
        excludedType: 'ТО'
    });

    const [form, setForm] = useState({
        id: '',
        name: '',
        type: '',
        type1: '',
        type2: '',
        payMethod: '',
        description: '',
        quantity: '',
        timeReturn: '',
        status: '',
        buhCounter: '',
        taskId: '',
        blockNumber: '',
        techName: '',
        brak: '',
        history: ''
    });

    const type_options = [
        { value: 'Монтажные', label: '🛠️ Монтажные' },
        { value: 'Инструменты', label: '🧰 Инструменты' },
        // { value: 'РемКомплект', label: '🧷 РемКомплект' }
    ]

    const montazh_options = [
        { value: 'Охранные Блоки', label: '🔒 Охранные Блоки' },
        { value: 'Видеокамеры', label: '🎥 Видеокамеры' },
        { value: 'Датчики', label: '🌡️ Датчики' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    //TODO - Заменить все select'ы на react-select'ы для отображения иконок (эмодзи не работают на некоторых браузерах)
    const instrument_options = [
        { value: 'Измерительные приборы', label: 'Измерительные приборы' },
        { value: 'Ручные инструменты', label: 'Ручные инструменты' },
        { value: 'Лестницы', label: 'Лестницы' },
        { value: 'Дрели', label: 'Дрели' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    const rashodnik_options = [
        { value: 'Аккумуляторы', label: '🔋 Аккумуляторы' },
        { value: 'Ключи', label: '🔑 Ключи' },
        { value: 'Кабели', label: '🔌 Кабели' },
        { value: 'Прочее', label: 'Прочее' }
    ]

    const block_options = [
        { value: 'Си-Норд', label: 'Си-Норд' },
        { value: 'Неман', label: 'Неман' },
        { value: 'Струна', label: 'Струна' },
        { value: 'Ларс', label: 'Ларс' },
        { value: 'Другой', label: 'Другой' }
    ]

    const sensor_options = [
        { value: 'Астра-8', label: 'Астра-8' },
        { value: 'Другой', label: 'Другой' }
    ]

    const short_names = {
        "Охранные блоки": "Охранный Блок",
        "Видеокамеры": "Видеокамера",
        "Датчики": "Датчик",
        "Измерительные приборы": "Измерительный прибор",
        "Ручные инструменты": "Ручной инструмент",
        "Лестницы": "Лестница",
        "Дрели": "Дрель",
        "Аккумуляторы": "Аккумулятор",
        "Ключи": "Ключ",
        "Кабели": "Кабель",
    }

    //React Icons for older browsers
    // FaWrench
    // FaToolbox
    // FaPaperclip

    // FaLock
    // FaCameraRetro

    // FaRulerCombined
    // FaHammer

    // FaCarBattery
    // FaKey


    const info_history = (item) => {

        const history_paragraphs = {
            create: <span style={{ color: '#003366' }}>Создано</span>,
            install: <span style={{ color: 'green' }}>Установлено</span>,
            equip: <span style={{ color: 'yellow' }}>Экипировано</span>,
            delete: <span style={{ color: 'red' }}>Удалено</span>,

            //при editStatus:
            Выдан: <span style={{ color: '#f77f00' }}>Выдано</span>,
            Утерян: <span style={{ color: '#d62828' }}>Утеряно</span>,
            Возвращен: <span style={{ color: '#023047' }}>Возвращено</span>,
            Восстановлен: <span style={{ color: '#006d77' }}>Восстановлено</span>,
            Удален: <span style={{ color: 'red' }}>Удалено</span>
        }

        return (JSON.parse(item.history)?.map(el =>
            <div className={styles.historyParagraphs}>

                <p onMouseOver={e => setShowExtraInfo([...showExtraInfo, el.date])} onMouseOut={e => setShowExtraInfo(showExtraInfo.filter(elem => elem !== el.date))}>{el.type === "editStatus" ? history_paragraphs[el.value.status] : history_paragraphs[el.type]}</p>

                <span className = {styles.extraInfoParagraphs}>

                    <p>{el.date}</p>
                    {showExtraInfo.includes(el.date) && el.value.hasOwnProperty('techName') ? el.techName !== "" ? <p style={{"color": "#390099" }}> Техник: {el.value.techName.split(" ")[0]}</p> : null : null}
                    {showExtraInfo.includes(el.date) && el.hasOwnProperty('user') ? el.user !== "" ? <p style={{"color": "#9e0059" }}> Изменил: {el.user.split(" ")[0]}</p> : null : null}
                    {showExtraInfo.includes(el.date) && el.hasOwnProperty('blockNumber') ? el.blockNumber !== "" ? <p style={{"color": "#9e0059" }}> Номер блока: {el.blockNumber.split(" ")[0]}</p> : null : null}
                    {showExtraInfo.includes(el.date) && el.hasOwnProperty('taskId') ? el.taskId !== "" ? <p style={{"color": "#9e0059" }}> ID Заявки: {el.taskId.split(" ")[0]}</p> : null : null}

                </span>
            </div>
        ))
    }

    //Закрыть это Всплывающее Окно
    const closePopUp = (element) => {
        element.stopPropagation()
        close(false)
        //console.log("Окно Закрыто")
    }

    return (
        // Дивы, отвечающие за размер Всплывающего Окна
        <div className={styles.wrapper}> <div className={styles.popUpWrapper}> <div className={styles.closeWrapper} onClick={(e) => { closePopUp(e); }}><img src={Close} alt="" /></div>

            {/* ANCHOR - МЕТОД - Информация об объекте */}
            {method === "info" ?
                <div className={styles.equipmentInfo}>
                    <div className={styles.block}>
                        <p className={styles.title}>{item.name}</p>
                        <p>Тип: {item.type1}{item.type2 ? "/" + item.type2 : ""}</p>
                        <p>Описание: {item.description}</p>
                        <p>Статус: {item.status}</p>
                        <p>Закреплен за: {item.techName}</p>
                        {item.payMethod ? <p>Вид оплаты: {item.payMethod}</p> : null}
                        {item.quantity ? <p>Количество: {item.quantity}</p> : null}
                        {item.blockNumber && item.blockNumber !== "0" ? <p>Закреплен за блоком: №{item.blockNumber}</p> : null}

                    </div>

                    <div className={styles.block}>
                        <p className={styles.title}>История:</p>
                        {info_history(item)}

                    </div>
                </div>
                : null}

            {/* ANCHOR - МЕТОД - Создание объекта */}
            {method === "create" ?
                <div className={styles.equipmentCreate}>

                    <b>Вид оборудования:</b>
                    <select onChange={(e) => {
                        setForm(prevState => ({ ...prevState, type: e.target.value, name: "", type1: "", type2: "" }))
                    }}>
                        {type_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                        <option value="" selected disabled hidden>Выберите Вип Оборудования</option>
                    </select>

                    {form.type !== "" ? <div>
                        <b>Тип оборудования:</b>
                        <select onChange={(e) => {
                            setForm(prevState => ({ ...prevState, type1: e.target.value, name: short_names[e.target.value] }))
                        }}>
                            {form.type === "Монтажные" ? montazh_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {form.type === "Инструменты" ? instrument_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null}
                            {/* {form.type === "РемКомплект" ? rashodnik_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>) : null} */}
                            <option value="" selected disabled hidden>Выберите Тип Оборудования</option>
                        </select>


                        {form.type1 === "Охранные Блоки" ? <div> <b>Тип блока:</b>
                            <select onChange={(e) => {
                                setForm(prevState => ({ ...prevState, type2: e.target.value, name: e.target.value + " №" }))
                            }}>
                                {block_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                                <option value="" selected disabled hidden>Выберите Тип Блока</option>
                            </select>
                        </div>
                            : null}

                        {form.type1 === "Датчики" ? <div> <b>Тип блока:</b>
                            <select onChange={(e) => {
                                setForm(prevState => ({ ...prevState, type2: e.target.value, name: e.target.value + " №" }))
                            }}>
                                {sensor_options.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}
                                <option value="" selected disabled hidden>Выберите Тип Датчика</option>
                            </select>
                        </div>
                            : null}


                        {/* {form.type === "РемКомплект" ? <div>
                            <b>Количество:</b>
                            <div className={styles.rashodnikQuantity}>
                                <label style={{ "color": form.quantity === "Единичный" ? "#003366" : "grey", "borderColor": form.quantity === "Единичный" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Единичный" name="quantity" checked={form.quantity === 'Единичный'} onChange={(e) => setForm((prevState) => ({ ...prevState, quantity: e.target.value }))} />
                                    <MdAttachment style={{ "padding-right": "0.1rem" }} />Единичный
                                </label>
                                <label style={{ "color": form.quantity === "Множественный" ? "#003366" : "grey", "borderColor": form.quantity === "Множественный" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Множественный" name="quantity" checked={form.quantity === 'Множественный'} onChange={(e) => setForm((prevState) => ({ ...prevState, quantity: e.target.value }))} />
                                    <MdAutoAwesomeMotion style={{ "padding-right": "0.1rem" }} />Множественный
                                </label>
                            </div> </div>
                            : null} */}

                        <b>Наименование Оборудования:</b>
                        <input type="text" value={form.name} onChange={(e) => {
                            setForm(prevState => ({ ...prevState, name: e.target.value }))
                        }}></input>


                        {form.type === "Монтажные" ?
                            <div>
                                <b>Номер Заявки*:</b>
                                <input style={{ "width": "20%" }} type="text" value={form.buhCounter} onChange={(e) => {
                                    if (/^\d+$/.test(e.target.value) || e.target.value.length === 0) {
                                        setForm(prevState => ({ ...prevState, buhCounter: e.target.value }))
                                    }
                                }}></input>

                                <b>Вид оплаты*:</b>
                                <div className={styles.divPayMethod}>
                                    <label style={{ "color": form.payMethod === "Оплачено" ? "#003366" : "grey", "borderColor": form.payMethod === "Оплачено" ? "#003366" : "grey" }}>
                                        <input type="radio" value="Оплачено" name="payMethod" checked={form.payMethod === 'Оплачено'} onChange={(e) => setForm((prevState) => ({ ...prevState, payMethod: e.target.value }))} />
                                        <MdSell style={{ "padding-right": "0.1rem" }} />Оплачено
                                    </label>
                                    <label style={{ "color": form.payMethod === "Аренда" ? "#003366" : "grey", "borderColor": form.payMethod === "Аренда" ? "#003366" : "grey" }}>
                                        <input type="radio" value="Аренда" name="payMethod" checked={form.payMethod === 'Аренда'} onChange={(e) => setForm((prevState) => ({ ...prevState, payMethod: e.target.value }))} />
                                        <MdOutlineMonetizationOn style={{ "padding-right": "0.1rem" }} />Аренда
                                    </label>
                                </div>
                            </div> : null}

                        {form.type === "Инструменты" ?
                            <div>
                                <b>Вернуть через (дней)*:</b>
                                <div className={styles.divTimeReturn}>
                                    <label style={{ "color": form.timeReturn === "1 день" ? "#003366" : "grey", "borderColor": form.timeReturn === "1 день" ? "#003366" : "grey" }}>
                                        <input type="radio" value="1 день" name="timeReturn" checked={form.timeReturn === '1 день'} onChange={(e) => setForm((prevState) => ({ ...prevState, timeReturn: e.target.value }))} />
                                        <MdOutlineLooksOne style={{ "padding-right": "0.1rem" }} />1 день
                                    </label>
                                    <label style={{ "color": form.timeReturn === "2 дня" ? "#003366" : "grey", "borderColor": form.timeReturn === "2 дня" ? "#003366" : "grey" }}>
                                        <input type="radio" value="2 дня" name="timeReturn" checked={form.timeReturn === '2 дня'} onChange={(e) => setForm((prevState) => ({ ...prevState, timeReturn: e.target.value }))} />
                                        <MdOutlineLooksTwo style={{ "padding-right": "0.1rem" }} />2 дня
                                    </label>
                                    <label style={{ "color": form.timeReturn === "Неограниченно" ? "#003366" : "grey", "borderColor": form.timeReturn === "Неограниченно" ? "#003366" : "grey" }}>
                                        <input type="radio" value="Неограниченно" name="timeReturn" checked={form.timeReturn === 'Неограниченно'} onChange={(e) => setForm((prevState) => ({ ...prevState, timeReturn: e.target.value }))} />
                                        <MdHourglassDisabled style={{ "padding-right": "0.1rem" }} />Неограниченно
                                    </label>
                                </div>
                            </div> : null}

                        <b>Доп. Описание*:</b>
                        <input type="text" value={form.description} onChange={(e) => {
                            setForm(prevState => ({ ...prevState, description: e.target.value }))
                        }}></input>
                    </div> : null}

                    <b>Техник:</b>
                    <select onChange={(e) => {
                        setForm(prevState => ({ ...prevState, techName: e.target.value }))
                    }}>
                        {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
                        <option value="Иралиев Фарид Апахович">{"Иралиев Фарид Апахович"}</option>
                        <option value="" selected disabled hidden>Выберите Техника</option>
                    </select>

                    <p></p>
                    <button onClick={async (e) => {
                        if (form.type === '') {
                            alert('Необходимо указать вид оборудования!!');
                            return;
                        } else if (form.type1 === '') {
                            alert('Необходимо указать тип оборудования!!');
                            return;
                        } else if (form.name === '') {
                            alert('Необходимо указать имя оборудования!!');
                            return;
                        } else if ((form.type1 === 'Охранные блоки' || form.type1 === 'Датчики') && form.type3 === '') {
                            alert('Необходимо указать тип блока/датчика!!');
                            return;
                            // } else if (form.type === 'РемКомплект' && form.quantity === '') {
                            //     alert('Необходимо указать количество расходников!!');
                            //     return;
                        } else if (form.techName === '') {
                            alert('Необходимо указать техника!!');
                            return;
                        } else {
                            await createEquipment(form, user) ?
                                closePopUp(e)
                                : console.log("Ошибка создания")
                        }
                    }
                    }>Добавить оборудование</button>
                </div>
                : null}

            {/* ANCHOR - МЕТОД -Изменение Статуса */}
            {method === "editStatus" ?
                <div className={styles.equipmentEditStatus}>

                    {item.status === "Установлен" ?
                        <div>
                            <b>Блок Установлен: </b><b style={{ "color": "green" }}>{JSON.parse(item.history).filter(el => el.type === "install").slice(-1)[0].date}</b><br />
                            <b>Пультовой Номер Блока: </b><b style={{ "color": "green" }}>{JSON.parse(item.history).filter(el => el.type === "install").slice(-1)[0].value.blockNumber}</b><br />
                            <b>Установил: </b><b style={{ "color": "green" }}>{JSON.parse(item.history).filter(el => el.type === "install").slice(-1)[0].value.techName}</b><br />
                        </div> : <div>
                            <p>Статус: {item.status}</p>
                            <p>Название: {item.name}</p>
                            <p>Закреплен за: {item.techName}</p>
                        </div>}

                    {selectedStatus ?
                        selectedStatus === "Выдан" ? <div>
                            {/* TODO - Сделать привязку к заявке */}
                            <b className={styles.title}>Привязать:</b>

                            <div className={styles.divIssueMethod}>
                                <label style={{ "color": issueMethod === "Заявка" ? "#003366" : "grey", "borderColor": issueMethod === "Заявка" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Заявка" name="issueMethod" checked={issueMethod === 'Заявка'} onChange={(e) => setIssueMethod("Заявка")} />
                                    <MdOutlineLooksOne style={{ "padding-right": "0.1rem" }} />Заявка
                                </label>
                                <label style={{ "color": issueMethod === "Пультовой Номер Блока" ? "#003366" : "grey", "borderColor": issueMethod === "Пультовой Номер Блока" ? "#003366" : "grey" }}>
                                    <input type="radio" value="Пультовой Номер Блока" name="issueMethod" checked={issueMethod === 'Пультовой Номер Блока'} onChange={(e) => setIssueMethod("Пультовой Номер Блока")} />
                                    <MdOutlineLooksTwo style={{ "padding-right": "0.1rem" }} />Пультовой Номер Блока
                                </label>
                            </div>


                            {issueMethod === "Заявка" ?

                                <div>
                                    {/* <select onChange={(e) => {
                                        setSelectedTechName(e.target.value);
                                    }}>
                                        {dep.map(e => e.LAST_NAME + " " + e.NAME + " " + e.SECOND_NAME).filter(el => !el.includes("Начальник")).map(el => <option value={el} key={el}>{el}</option>)}
                                        <option value="Иралиев Фарид Апахович">{"Иралиев Фарид Апахович"}</option>
                                        <option value="" selected disabled hidden>Выберите Техника</option>
                                    </select> */}


                                    {/* <b>Только Сегодня</b>
                                    <input className={styles.checkbox} type="checkbox" checked={tasksFilter.dateCreate===Date.now()} onClick={e => e.target.checked ? setTasksFilter(array => ({...array, dateCreate: Date.now()})) : setTasksFilter(array => ({...array, dateCreate: ''}))}></input> */}

                                    <b>Без ТО</b>
                                    <input className={styles.checkbox} type="checkbox" checked={tasksFilter.excludedType === "ТО"} onClick={e => e.target.checked ? setTasksFilter(array => ({ ...array, excludedType: "ТО" })) : setTasksFilter(array => ({ ...array, excludedType: "" }))}></input>


                                    <div className={styles.divIssueMethodTasks}>
                                        {tasks.filter(el => el[42] === item.techName && (el[18] === "Новая" || el[18] === "В работе") && el[8] !== tasksFilter.excludedType).map(element =>
                                            <div className={styles.divReqInfo} style={{ "color": tasksFilter.id === element[0] ? "#003366" : "grey", "borderColor": tasksFilter.id === element[0] ? "#003366" : "grey" }} onClick={e => tasksFilter.id !== element[0] ? setTasksFilter(array => ({ ...array, id: element[0] })) : setTasksFilter(array => ({ ...array, id: '' }))}>
                                                <div className={styles.divReqInfoText}>
                                                    <b style={{ fontWeight: "bold", "color": tasksFilter.id === element[0] ? "#003366" : "grey", "borderColor": tasksFilter.id === element[0] ? "#003366" : "grey" }}>{element[8]}</b>
                                                    <p style={{ textDecoration: "underline", "color": tasksFilter.id === element[0] ? "#003366" : "grey", "borderColor": tasksFilter.id === element[0] ? "#003366" : "grey" }}>{element[2]}</p>
                                                    <p style={{ "color": tasksFilter.id === element[0] ? "#003366" : "grey", "borderColor": tasksFilter.id === element[0] ? "#003366" : "grey" }}>{element[4]}</p>
                                                    <p style={{ fontStyle: "italic", "color": tasksFilter.id === element[0] ? "#003366" : "grey", "borderColor": tasksFilter.id === element[0] ? "#003366" : "grey" }}>Создана: {element[17]}</p>
                                                </div>
                                            </div>)
                                        }
                                    </div> </div> : null}


                            {issueMethod === "Пультовой Номер Блока" ? <div className={styles.divIssueMethodBlockNumber}>
                                {noBlockNumberCheck === false ? <div>
                                    <p className={styles.title}>Введите Пультовой Номер Блока:</p>
                                    <input type="text" value={form.blockNumber} onChange={(e) => {
                                        setForm(prevState => ({ ...prevState, blockNumber: e.target.value }))
                                    }}></input>
                                </div> : null}
                                <p className={styles.title} style={{ display: 'inline' }}>Без Пультового Номера Блока:</p>
                                <input className={styles.checkbox} type="checkbox" checked={noBlockNumberCheck} onClick={e => e.target.checked ? setNoBlockNumberCheck(true) : setNoBlockNumberCheck(false)}></input>
                            </div> : null}

                            <button style={{ backgroundColor: '#f77f00' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Выдан', techName: item.techName, taskId: tasksFilter.id !== 0 ? tasksFilter.id : 0, blockNumber: noBlockNumberCheck !== 0 ? form.blockNumber : "0" }, user).then(closePopUp(e))
                            }>Выдать</button>
                        </div> : null


                        : <div>
                            {item.status === "Установлен" ?
                                <button style={{ backgroundColor: '#386641' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Установлен (Подтвержден)', techName: item.techName }, user).then(closePopUp(e))}>Подтверждено</button> : null}
                            {item.status === "Установлен" ?
                                <button style={{ backgroundColor: '#bc4749' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Брак', techName: item.techName }, user).then(closePopUp(e))}>Брак</button> : null}


                            {item.status === "Создан" || item.status === "Возвращен" || item.status === "Восстановлен" ?
                                <button style={{ backgroundColor: '#f77f00' }} onClick={e => setSelectedStatus("Выдан")}>Выдать</button> : null}
                            {item.status === "Выдан" ?
                                <button style={{ backgroundColor: '#d62828' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Утерян', techName: item.techName }, user).then(closePopUp(e))}>Утерян</button> : null}
                            {item.status === "Выдан" ?
                                <button style={{ backgroundColor: '#023047' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Возвращен', techName: item.techName }, user).then(closePopUp(e))}>Возвращен</button> : null}

                            {item.status === "Удален" ?
                                <button style={{ backgroundColor: '#006d77' }} onClick={e => editEquipment("editStatus", { id: item.id, status: 'Восстановлен', techName: item.techName }, user).then(closePopUp(e))}>Восстановить</button> : null}
                        </div>}

                </div> : null}


        </div></div>);
};

export default EquipmentPopUp;