import React, { useEffect, useState } from 'react';
import styles from './CreateTask.module.scss'
import Select from 'react-select'
import { useStore } from "effector-react";
import { createTask } from "../../actions/CreateTask";
import { $firstTime, $secondTime } from "../../state/techTime";
import { $depStatus, $user } from "../../state/user";
import SearchItems from "./SearchItems";
import Back from '../../img/back.png'
import Create from '../../img/check.png'
import { $loading } from "../../state/loading";
import Loader from "../Loader/Loader";
import Info from '../../img/info.png'
import { $allReqStatus } from "../../state";
import { $planStatus } from "../../state/plan";
import { $graphData } from "../../state/GraphTask";
import { $customerStatus, getCustomer, setCustomer } from "../../state/getCustomerByPhone";
import { $items } from '../../store/objectWithAndromeda'

const utils = ['ОС', 'ПС', 'ВН', 'КТС', 'ТО', 'Иное (написать в комментарий)']

const PopUpWithTimer = () => {
    const [visible, setvisible] = useState(true)
    useEffect(() => {
        let timer = setTimeout(() => setvisible(false), 3000);

        return () => clearTimeout(timer);
    })

    return visible && <div className={styles.popUpWt}>
        <p>Клиент не найден</p>
    </div>
}

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
        data.OBJ.length === 0 ? <PopUpWithTimer /> : <div className={styles.popUp}>
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

const CreateTask = ({ func }) => {
    const user = useStore($user);
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);
    const loading = useStore($loading);
    const customer = useStore($customerStatus);
    const dep = useStore($depStatus);

    const allReq = useStore($allReqStatus);
    const plan = useStore($planStatus);
    const graph = useStore($graphData);

    const noformatDate = new Date();

    const optionsDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    const intlDate = Intl.DateTimeFormat('zh-CN', optionsDate);
    const formatedDate = intlDate.format(noformatDate).split(', ');
    formatedDate[0] = formatedDate[0].replaceAll('/', '-');

    const [form, setForm] = useState({
        type: '',
        objNum: '',
        name: '',
        address: '',
        customer: '',
        comment: '',
        vo: [],
        voText: '',
        clientPhone: '',
        clientFio: '',
        date: formatedDate,
        changeTech: false,
        files: '',
        label: '',
        timeJob: '0.5'
    });
    const options = [
        { value: '', label: 'Заявка' },
        { value: 'Претензия', label: 'Претензия' },
        { value: 'СО', label: 'Снятие Объемов' },
        { value: 'ТО', label: 'Техническое Обслуживание' },
        { value: 'Демонтаж', label: 'Демонтаж' },
        { value: 'Монтаж', label: 'Монтаж' },
        { value: 'Подключение', label: 'Подключение' },
        { value: 'Нет контрольного события', label: 'Нет контрольного события' },
    ]
    const zayavka_options = [
        { value: 'Снятие/Постановка', label: 'Снятие/Постановка' },
        { value: 'Шлейф', label: 'Шлейф' },
        { value: 'КТС', label: 'КТС' },
        { value: 'Ключ', label: 'Ключ' },
        { value: '220', label: '220' },
        { value: 'Заявка', label: 'Прочее' }
    ]
    const [focusNum, setFocusNum] = useState(false);
    const [focusName, setFocusName] = useState(false);
    const [focusAddress, setFocusAddress] = useState(false);
    const [focusUtils, setFocusUtils] = useState(false);

    const [create, setCreate] = useState(false);

    const options2 = dep
        .filter(el => el.WORK_POSITION && !(el.WORK_POSITION.includes('Водитель'))) // из-за этого условия не работает & !(el.WORK_POSITION.includes('Начальник'))
        .map(el => ({ value: `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`, label: `${el.LAST_NAME} ${el.NAME[0]}.${el.SECOND_NAME[0]}` }))

    const items = useStore($items);

    const [allEquipment, setAllEquipment] = useState([]);
    useEffect(() => {
        if ((user.UF_DEPARTMENT[0] === 13 || user.UF_DEPARTMENT[0] === 15) && create === false) {
            fetch(`https://volga24bot.com/kartoteka/api/tech/daily/getAllEquipment.php`)
                .then(res => res.json())
                .then(data => setAllEquipment(data.items))
                .catch(e => console.log(e))
        }
    }, [create])

    return (
        <>
            <div className={styles.createTaskWrapper} >
                <header>
                    <img src={Back} alt="" onClick={func} />
                    <img src={Create} alt="" onClick={async () => {
                        await createTask(form, func, firstTime, secondTime, user, plan.CURRENT, graph)
                        // allEquipment.map(item => selectedEquipment.includes(item.id) ? editEquipment("editStatus", { id: item.id, status: 'Выдан', techName: item.techName, taskId: tasksFilter.id !== 0 ? tasksFilter.id : 0, blockNumber: noBlockNumberCheck !== 0 ? form.blockNumber : "0" }, user) : null)
                    }} />
                </header>
                <div className={styles.infoCreate}>
                    <img src={Info} alt="" />
                    <p>Введя номер телефона клиента, будет произведен поиск всех его объектов, далее можно выбрать один из них, для автозаполения</p>
                </div>
                <div className={styles.createTaskForm}>
                    {form.type}
                    <label>
                        <b>Вид заявки</b>
                        <Select onFocus={() => {
                            setFocusNum(false);
                            setFocusAddress(false);
                            setFocusName(false);
                            setFocusUtils(false);
                        }}
                        onChange={(selectedOption) => {
                            const newComment = selectedOption.value === "ТО" ? "Ежеквартальное ТО" : "";
                            setForm(prevState => ({
                                ...prevState,
                                type: selectedOption.value,
                                comment: newComment,
                                timeJob: '0.5'
                            }));
                        }}
                        options={options.map(el => ({ value: el.value, label: el.label }))}
                        placeholder="Выберите вид заявки"/>
                    </label>
                    {form.type === 'Заявка' || form.type === '' || form.type === 'ТО' || form.type === 'Демонтаж' || form.type === 'Претензия' || form.type === 'Нет контрольного события'
                        || form.type === 'Снятие/Постановка' || form.type === 'Шлейф' || form.type === 'КТС' || form.type === 'Ключ' || form.type === '220' ?
                        <>

                            {form.type === 'Заявка' || form.type === '' || form.type === 'Снятие/Постановка' || form.type === 'Шлейф'
                                || form.type === 'КТС' || form.type === 'Ключ' || form.type === '220' ? <label>
                                <b>Проблема</b>
                                <Select
                                    onFocus={() => {
                                        setFocusNum(false);
                                        setFocusAddress(false);
                                        setFocusName(false);
                                        setFocusUtils(false);
                                    }}
                                    onChange={(selectedOption) => {
                                        let newComment = "";
                                        setForm(prevState => ({
                                            ...prevState,
                                            type: selectedOption.value,
                                            comment: newComment
                                        }));
                                    }}
                                    options={zayavka_options.map(el => ({ value: el.value, label: el.label }))}
                                    placeholder="Выберите проблему"
                                />
                            </label>
                                : null}
                            <div style={{ position: 'relative' }} >
                                <label>
                                    № объекта
                                    <input type="text" onFocus={() => {
                                        setFocusNum(true)
                                        setFocusAddress(false)
                                        setFocusName(false)
                                        setFocusUtils(false)
                                    }} className={styles.inputText} value={form.objNum} onChange={(e) => setForm(prevState => ({ ...prevState, objNum: e.target.value }))} />
                                </label>
                                {focusNum ? <SearchItems value={form.objNum} items={items} type={"id"} func={(a, b, c) => setForm(prevState => ({ ...prevState, objNum: a, name: b, address: c }))} focus={() => setFocusNum(false)} /> : null}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label>
                                    Адрес объекта
                                    <input type="text" onFocus={() => {
                                        setFocusNum(false)
                                        setFocusAddress(true)
                                        setFocusUtils(false)
                                        setFocusName(false)
                                    }} className={styles.inputText} value={form.address} onChange={(e) => setForm(prevState => ({ ...prevState, address: e.target.value }))} />
                                </label>
                                {focusAddress ? <SearchItems value={form.address} items={items} type={"Address"} func={(a, b, c) => setForm(prevState => ({ ...prevState, objNum: a, name: b, address: c }))} focus={() => setFocusAddress(false)} /> : null}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label>
                                    Название объекта
                                    <input type="text" onFocus={() => {
                                        setFocusNum(false)
                                        setFocusAddress(false)
                                        setFocusName(true)
                                        setFocusUtils(false)
                                    }} className={styles.inputText} value={form.name} onChange={(e) => setForm(prevState => ({ ...prevState, name: e.target.value }))} />
                                </label>
                                {focusName ? <SearchItems value={form.name} items={items} type={"Name"} func={(a, b, c) => setForm(prevState => ({ ...prevState, objNum: a, name: b, address: c }))} focus={() => setFocusName(false)} /> : null}
                            </div>
                            {form.type !== 'Нет контрольного события' ? <label>
                                Тел. клиента	
								<input type="text" onFocus={() => {
									setFocusNum(false);
									setFocusAddress(false);
									setFocusName(false);
									setFocusUtils(false);
								}}
								className={styles.inputText}
								value={form.clientPhone}
								onChange={(e) => {
									let phoneNumber = e.target.value;
									let formatPhone;
									if (phoneNumber.startsWith('+')) {
										phoneNumber = '+' + phoneNumber.slice(1).replace(/[^\d]/g, '');
									} else {
										phoneNumber = phoneNumber.replace(/[^\d]/g, '');
									}
									
									const isPlus7 = phoneNumber.startsWith('+7');
									if (isPlus7) {
										formatPhone = phoneNumber.replace('+7', '8');
									} else {
										formatPhone = phoneNumber;
									}

									const maxLength = isPlus7 ? 12 : 11;
									if (phoneNumber.length > maxLength) {
										phoneNumber = phoneNumber.slice(0, maxLength);
									}

									setForm(prevState => ({ ...prevState, clientPhone: phoneNumber}));

									if (formatPhone.length === 11) {
										getCustomer(formatPhone);
									}
								}}
								placeholder="Формат: +7 либо 8"/>
                            </label> : null}
                            {form.type !== 'Нет контрольного события' ? <label>
                                ФИО. клиента
                                <input type="text" onFocus={() => {
                                    setFocusNum(false)
                                    setFocusAddress(false)
                                    setFocusName(false)
                                    setFocusUtils(false)
                                }} className={styles.inputText} value={form.clientFio} onChange={(e) => {
                                    setForm(prevState => ({ ...prevState, clientFio: e.target.value }))
                                }} />
                            </label> : null}

                        </>
                        : <div>
                            {/* Монтаж, СО и остальное */}
                            {form.type !== 'Задача' ? <label>
                                Адрес объекта
                                <input type="text" className={styles.inputText} value={form.address} onChange={(e) => setForm(prevState => ({ ...prevState, address: e.target.value }))} />
                            </label> : null}
                            {form.type !== 'Задача' ? <label>
                                Название объекта
                                <input type="text" className={styles.inputText} value={form.name} onChange={(e) => setForm(prevState => ({ ...prevState, name: e.target.value }))} />
                            </label> : null}
                            <label>
                                Тел. клиента	
								<input type="text" onFocus={() => {
									setFocusNum(false);
									setFocusAddress(false);
									setFocusName(false);
									setFocusUtils(false);
								}}
								className={styles.inputText}
								value={form.clientPhone}
								onChange={(e) => {
									let phoneNumber = e.target.value;
									let formatPhone;
									if (phoneNumber.startsWith('+')) {
										phoneNumber = '+' + phoneNumber.slice(1).replace(/[^\d]/g, '');
									} else {
										phoneNumber = phoneNumber.replace(/[^\d]/g, '');
									}
									
									const isPlus7 = phoneNumber.startsWith('+7');
									if (isPlus7) {
										formatPhone = phoneNumber.replace('+7', '8');
									} else {
										formatPhone = phoneNumber;
									}

									const maxLength = isPlus7 ? 12 : 11;
									if (phoneNumber.length > maxLength) {
										phoneNumber = phoneNumber.slice(0, maxLength);
									}

									setForm(prevState => ({ ...prevState, clientPhone: phoneNumber}));
								}}
								placeholder="Формат: +7 либо 8"/>
                            </label>
                            <label>
                                ФИО. клиента
                                <input type="text" className={styles.inputText} value={form.clientFio} onChange={(e) => {
                                    setForm(prevState => ({ ...prevState, clientFio: e.target.value }))
                                }} />
                            </label>
                        </div>}
                    <label>
                        Исполнитель
                        <Select options={user.UF_DEPARTMENT[0] === 15
                                ? options2.concat([{ value: 'Филиппов Артём Сергеевич', label: 'Филиппов А.С.' }]).concat([{ value: '', label: 'Общая (Нет исполнителя)' }])
                                : options2.concat([{ value: '', label: 'Общая (Нет исполнителя)' }])}
                            onChange={(e) => setForm(prevState => ({ ...prevState, customer: e.value }))}
                            placeholder={'Общая'} />
                    </label>
                    <label>
                        {form.type === 'ТО'
                            ? <>
                                <label>Период обслуживания ТО</label>
                                <Select options={[{ value: 'Ежеквартальное ТО', label: 'Ежеквартальное ТО' }, { value: 'Ежемесячное ТО', label: 'Ежемесячное ТО' }]} onChange={(e) => setForm(prevState => ({ ...prevState, comment: e.value }))} placeholder={'Выберите период'} />
                            </>
                            : <>
                                {form.type !== 'Нет контрольного события' ? 'Комментарий' : 'Дата появления проблемы'}
                                <textarea type="text" onFocus={() => {
                                    setFocusNum(false)
                                    setFocusAddress(false)
                                    setFocusName(false)
                                    setFocusUtils(false)
                                }} className={styles.inputLongText} value={form.comment} onChange={(e) => setForm(prevState => ({ ...prevState, comment: e.target.value }))} />
                            </>
                        }
                    </label>
                    {form.type !== 'Нет контрольного события' ? <label>
                        Услуги
                        <input 
                            type="text" 
                            onFocus={() => {
                                setFocusNum(false);
                                setFocusAddress(false);
                                setFocusName(false);
                                setFocusUtils(true);
                            }} 
                            placeholder={'OC, ПС, и т.д'} 
                            className={styles.inputText} 
                            value={form.voText} 
                            onChange={(e) => setForm(prevState => ({ ...prevState, voText: e.target.value }))} 
                        />
                        {focusUtils ? (
                            <div className={styles.utilsWrapper}>
                                {utils.map(el => (
                                    <label key={el} className={styles.utils}>
                                        <input 
                                            onChange={(e) => {
                                                if (el === 'Иное') {
                                                    // Добавляем "Иное", но не убираем галочку
                                                    setForm(prevState => ({
                                                        ...prevState,
                                                        vo: [...prevState.vo, el],
                                                        voText: [...prevState.vo, el].join(',')
                                                    }));
                                                } else {
                                                    if (e.target.checked) {
                                                        // Добавляем элемент в список
                                                        const newVo = [...form.vo, el];
                                                        setForm(prevState => ({
                                                            ...prevState,
                                                            vo: newVo,
                                                            voText: newVo.join(',')
                                                        }));
                                                    } else {
                                                        // Убираем элемент из списка
                                                        const newVo = form.vo.filter(el2 => el2 !== el);
                                                        setForm(prevState => ({
                                                            ...prevState,
                                                            vo: newVo,
                                                            voText: newVo.join(',')
                                                        }));
                                                    }
                                                }
                                            }} 
                                            type="checkbox" 
                                            checked={form.vo.includes(el)} // Проверяем, включен ли элемент
                                        />
                                        {el}
                                    </label>
                                ))}
                            </div>
                        ) : null}
                    </label> : null}
                    <label>
                        Дата выполнения
                        <input type="datetime-local" onFocus={() => {
                            setFocusNum(false)
                            setFocusAddress(false)
                            setFocusName(false)
                            setFocusUtils(false)
                        }} className={styles.inputText} value={form.date} onChange={(e) => { setForm(prevState => ({ ...prevState, date: e.target.value })); }} />
                    </label>
                    <label>
						Время на работу (час):
						<input
							type="number"
							className={styles.inputText}
							value={form.timeJob}
							onChange={(e) => {
								const value = Math.max(0.5, parseFloat(e.target.value));
								setForm(prevState => ({ ...prevState, timeJob: value.toFixed(1) }));
							}}
							step = "0.5"
							min = "0.5"
							max = "168"
						/>
					</label>
                    <div className={styles.flex_box}>
                        <label className={styles.checkbox}>

                            <input type="checkbox" checked={form.changeTech} onChange={() => setForm(prevState => ({ ...prevState, changeTech: !form.changeTech }))} />
                            Запретить передавать
                        </label>
                        <label className={styles.files}>
                            <input type="file" onChange={(e) => setForm(prevState => ({ ...prevState, files: e.target.files }))} multiple />
                            {form.files.length ? `Загружено файлов: ${form.files.length}` : 'Выберите файлы'}
                        </label>
                    </div>
                    {customer.OBJ && customer !== 'loading' ? <PopUp data={customer} func={(a = '', b = '', c = '', d = '') => setForm(prevState => ({ ...prevState, name: a, address: b, clientFio: c, objNum: d }))} /> : null}
                </div>
                {loading || customer === 'loading' ? <Loader /> : null}
            </div>
            {/* {create ? <EquipmentPopUp method="create" close={(a) => setCreate(a)} /> : null} */}
        </>
    );
}

export default CreateTask;
