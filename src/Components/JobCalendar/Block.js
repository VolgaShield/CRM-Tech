import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './JobCalendar.module.scss'


const Block1 = ({techs, children}) => {

    return (
        <div>
            <div className={styles.techChecks}>
                <div>
                    <p>Заступили:</p>
                    <ul>
                        <li>{techs.filter(el => el[1].indexOf('Трифонов') !== -1).length > 0 ? 'Трифонов О.В' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Биялиев') !== -1).length > 0 ? 'Биялиев Г.С' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Зотов') !== -1).length > 0 ? 'Зотов В.П' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Макаренко') !== -1).length > 0 ? 'Макаренко Н.Н' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Уткин') !== -1).length > 0 ? 'Уткин В.Н' : null}</li>
                    </ul>
                </div>
                <div>
                    <p>Не заступили:</p>
                    <ul>
                        <li>{techs.filter(el => el[1].indexOf('Трифонов') !== -1).length === 0 ? 'Трифонов О.В' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Биялиев') !== -1).length === 0 ? 'Биялиев Г.С' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Зотов') !== -1).length === 0 ? 'Зотов В.П' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Макаренко') !== -1).length === 0 ? 'Макаренко Н.Н' : null}</li>
                        <li>{techs.filter(el => el[1].indexOf('Уткин') !== -1).length === 0 ? 'Уткин В.Н' : null}</li>
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



export default Block1;
