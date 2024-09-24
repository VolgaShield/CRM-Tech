import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './JobCalendar.module.scss'


const Block2 = ({techs, children}) => {

    return (
        <div>
            <div className={styles.techChecks}>
                <div>
                    <p>Заступили:</p>
                    <ul>
                        <li>{techs.filter(el => el[1].indexOf('Киселёв') !== -1).length > 0 ? 'Киселёв К.В' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Кирюшкин') !== -1).length > 0 ? 'Кирюшкин О.Ю' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Ларионов') !== -1).length > 0 ? 'Ларионов А.А' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Деменков') !== -1).length > 0 ? 'Деменков А.М' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Фатиги') !== -1).length > 0 ? 'Фатиги И.И' : null}</li>
                    </ul>
                </div>
                <div>
                    <p>Не заступили:</p>
                    <ul>

                            <li>{techs.filter(el => el[1].indexOf('Киселёв') !== -1).length === 0 ? 'Киселёв К.В' : null}</li>
                            <li>{techs.filter(el => el[1].indexOf('Кирюшкин') !== -1).length === 0 ? 'Кирюшкин О.Ю' : null}</li>
                            <li>{techs.filter(el => el[1].indexOf('Ларионов') !== -1).length === 0 ? 'Ларионов А.А' : null}</li>
                            <li>{techs.filter(el => el[1].indexOf('Деменков') !== -1).length === 0 ? 'Деменков А.М' : null}</li>
                            <li>{techs.filter(el => el[1].indexOf('Фатиги') !== -1).length === 0 ? 'Фатиги И.И' : null}</li>
                    </ul>
                </div>
            </div>
            <div className={styles.tasks}>
                <p className={styles.title}>Выполнили:</p>
                <p>
                    Задач: 0 (В разработке)
                </p>
                <p>
                    ТО: 0 (В разработке)
                </p>
                <p>
                    Монтажей: 0 (В разработке)
                </p>
                <p>
                    Демонтажей 0 (В разработке)
                </p>
            </div>
            <p style={{textAlign: "center", marginTop: 10, color: "red"}}>Графики</p>
            {children}
        </div>
    );
}



export default Block2;
