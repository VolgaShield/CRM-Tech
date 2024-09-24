import React, {useEffect} from 'react';
import "./DatePicker.css"
import DatePicker from "react-datepicker";
import { registerLocale} from  "react-datepicker";
import ru from 'date-fns/locale/ru';


import "react-datepicker/dist/react-datepicker.css";
import {useStore} from "effector-react";

import {
    $firstTime,
    $secondTime,
    changeFirstTime,
    changeSecondTime,
    firstTimeAdd,
    firstTimeDelete
} from "../../state/raportTimeSearch";


const Input = ({onChange, placeholder, value, isSecure, id, onClick}) => (
    <input
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        id={id}
        onClick={onClick}
        inputMode="none"
    />
);

const DateComponent = ({get}) => {
    const firstTime = useStore($firstTime);
    const secondTime = useStore($secondTime);

    registerLocale('ru', ru)
    useEffect(() => {
        get({'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate()} 00:00:59`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth()+1) : secondTime.getMonth()+1 }-${secondTime.getDate()} 00:00:01`});
    }, [firstTime, secondTime])
    return (
        <div>
        <div className="d-flex data_picker_wrapper">
            <div className="d-flex column">
                <p className="data_picker_label">От</p>
                <div className="datePick">
                    <DatePicker selected={firstTime}
                                onChange={(date) => {
                                    changeFirstTime(date)
                                }}
                                onSelect={(date) => {
                                    get({'a': `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth()+1) : date.getMonth()+1 }-${date.getDate()} 00:00:59`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth()+1) : secondTime.getMonth()+1 }-${secondTime.getDate()} 00:00:01`});
                                }}
                                locale="ru"
                                dateFormat="P"
                                customInput={<Input/>}
                    />
                </div>

            </div>
            <div className="d-flex column">
                <p className="data_picker_label">До</p>
                <div className="datePick">
                    <DatePicker selected={secondTime}
                                onChange={(date) => {
                                    changeSecondTime(date)
                                }}
                                locale="ru"
                                onSelect={(date) => {
                                    get({'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate()} 00:00:59`, 'b': `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth()+1) : date.getMonth()+1 }-${date.getDate()} 00:00:01`});
                                }}
                                customInput={<Input/>}
                                dateFormat="P"
                    />
                </div>

            </div>

        </div>
            <div className="date-buttons">
                <button onClick={() => {
                    firstTimeDelete()
                }}>Назад</button>
                <button onClick={() => {
                    firstTimeAdd()
                }}>Вперед</button>
            </div>
        </div>
    );
}



export default DateComponent;
