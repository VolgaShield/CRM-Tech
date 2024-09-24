import React, {useCallback, useRef} from 'react';
import './EventItem.css';
import {setTask} from "../../state/task";
import {make3dTransformValue} from "react-quick-pinch-zoom";



const TaskItemWrapper = ({req}) => {


    const render = () => {

        const techs = req[7].split(',').filter(el => el.indexOf('Фатиги') === -1 && el.indexOf('Уткин') === -1);

            return (
                <div className="data_item__info">
                    <p className="data_item__info-title">Статус: {req[18] === 'Новая' ? 'Невыполнено' : req[18]}</p>
                    <p style={{color: 'green', fontSize: 16}}>{req[8]} №{req['i']}</p>
                    <p><span>{req[2]}</span></p>
                    <p>{req[4]}</p>
                    <p><span>Исполнитель: </span>{req[7]} </p>
                    <p><span>Информация: </span>{req[13]}</p>
                    <p><span>Поставлено</span> <span style={{marginLeft: 10}}> Время: </span> {req[17].substr(11,8)} <span style={{marginLeft: 10}}> Дата: </span>{req[17].substr(8,2)}.{req[17].substr(5,2)} </p>
                    <p> <span>Общ. время на выполнение:</span> {req[34]} чел/ч</p>
                    {req[18] === 'В работе' ? <p> <span>Текущ. время на выполнение:</span> {req[34] / techs.length} ч</p> : null}
                    {req[9] ? <p><span>Время выполнения: </span> {req[9]}</p> : null}
                    {req[12] ? <p><span>Выполненная работа: </span> {req[12]}</p> : null}
                    {req[27] || req[5] ? <p><span>Начало: </span><b>    {req[5].substr(11,5)}</b> - {req[27]}</p> : null}
                    {req[28] || req[6]? <p><span>Конец: </span><b>    {req[6].substr(11,5)}</b> - {req[28]}</p> : null}
                    {req[15] ? <p style={{color: "red"}}><span style={{color: "black"}}>Комментарий: </span> {req[15]}</p> : null}
                    {req[18] === 'Заявка выполнена' && req[8] === 'Заявка' ? <div className="req_images">
                        <p>АКТ</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/АКТ.png`} alt=""/>
                        <p>АКБ</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Фото_АКБ.png`} alt=""/>
                        <p>Осмотр</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Осмотр_объекта.png`} alt=""/>
                        <p>Пломба</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Пломба.png`} alt=""/>
                        <p>Неисправность</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Неисправность.png`} alt=""/>
                    </div> : null}
                    {req[18] === 'Выполнено' && req[8] === 'СО' ? <div className="req_images">
                        <p>Техзадание</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/tz/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[2].replace( /\s/g, "")}/Тз1.png`} alt=""/>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/tz/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[2].replace( /\s/g, "")}/Тз2.png`} alt=""/>
                    </div> : null}
                    {req[18] === 'Завершен' && req[8] === 'Монтаж' ? <div className="req_images">
                        <p>АКТ</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[1]}/Акт_выполненных_работ.png`} alt=""/>
                        <p>Анкета</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[1]}/Анкета.png`} alt=""/>
                        <p>Фасад</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[1]}/Фасад.png`} alt=""/>
                        <p>Схема</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[1]}/Схема.png`} alt=""/>
                        <p>Пломба</p>
                        <img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[1]}/Пломба.png`} alt=""/>
                    </div> : null}
                    {req[18] === 'Завершено' && req[8] === 'ТО' ? <div className="req_images">

                        <img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото1.png`} alt=""/>

                        <img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото2.png`} alt=""/>

                        <img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото3.png`} alt=""/>
                    </div> : null}
                </div>
            )
    }
    return (
        <div className="loading data_item">
            <div className="close-wrapper"  onClick={() => setTask(null)}><div className="close"></div></div>
            {render()}
        </div>
    );
}



export default TaskItemWrapper;
