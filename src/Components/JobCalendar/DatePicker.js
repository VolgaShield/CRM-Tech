import React, {useEffect} from 'react';

import DatePicker from "react-datepicker";
import { registerLocale} from  "react-datepicker";
import ru from 'date-fns/locale/ru';

import {useStore} from "effector-react";

import {
    $firstTime,
    changeFirstTime,

    firstTimeAdd,
    firstTimeDelete
} from "../../state/graphTime";


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

const DateComponent = ({get, func, get2}) => {
    const firstTime = useStore($firstTime);

    registerLocale('ru', ru)
    useEffect(() => {
        get(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);
        get2(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);
    }, [firstTime])
    return (
        <div>
            <div className="d-flex data_picker_wrapper datewrapper" >
                <div className="d-flex column">

                    <div className="datePick">
                        <DatePicker selected={firstTime}
                                    onChange={(date) => {
                                        changeFirstTime(date)
                                    }}
                                    onSelect={(date) => {
                                        get(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);
                                        get2(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 9 ? '0' + (firstTime.getMonth()+1) : firstTime.getMonth()+1 }-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate() }`);

                                    }}
                                    locale="ru"
                                    dateFormat="P"
                                    customInput={<Input/>}
                        />
                    </div>

                </div>


            </div>
            <div className="date-buttons">
                <button onClick={() => {
                    firstTimeDelete()
                    func()
                }}>Назад</button>
                <button onClick={() => {
                    firstTimeAdd()
                    func()
                }}>Вперед</button>
            </div>
        </div>
    );
}



export default DateComponent;
