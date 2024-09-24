import React from 'react';
import styles from "../JobCalendar.module.scss";
import {setOpenComment} from "../../../state/openComment";
import Plus from "../../../img/plus2.png";
import Minus from "../../../img/minus.png";
import {useStore} from "effector-react";
import {$techsStatus} from "../../../state/Techs";
import {$myTask} from "../../../state/myTask";
import {$depStatus} from "../../../state/user";
import {getLastName} from "../../../utils/getChief";

export const TechList = () => {
    const techs = useStore($techsStatus);
    const myTasks = useStore($myTask);
    const dep = useStore($depStatus);



    return (
        <div >
            <div className={styles.chief}>
                <div>
                    <h3 style={{margin: 0}}>Начальник</h3>
                    <ul>
                        {getLastName(dep) ?
                            <li
                                onClick={() => setOpenComment(dep.find(el => el.LAST_NAME === getLastName(dep)))}
                                className={techs.filter(el => el[1].indexOf(getLastName(dep) ) !== -1).length ? null : styles.minus}
                            >
                                <img
                                    src={techs.filter(el => el[1].indexOf(getLastName(dep))  !== -1).length ? Plus : Minus}
                                    alt=""
                                    style={{width: 14, paddingRight: 5}}
                                />
                                {getLastName(dep)}
                                <span> (Н)</span>
                                <span style={{color: 'red'}}>
                                    {myTasks.filter(el=>el[42].indexOf(getLastName(dep)) !== -1).length !== 0 ?
                                        `(${myTasks.filter(el=>el[42].indexOf(getLastName(dep)) !== -1).length})`
                                        : null}
                                </span>
                            </li> : <p>.</p>}
                    </ul>
                </div>
            </div>
            <ul className={styles.brigad}>
                {dep.filter((el) => el.LAST_NAME !== getLastName(dep)).map((el, i) => {
                    return <li
                        onClick={() => setOpenComment(el)}
                        className={
                            el.WORK_POSITION === 'Водитель' ?
                                techs.filter(el2 => el2[3].indexOf(`${el.LAST_NAME}`) !== -1).length ? null :styles.minus  :
                                techs.filter(el2 => el2[1].indexOf(`${el.LAST_NAME}`) !== -1).length ? null : styles.minus

                        } key={el.LAST_NAME}>
                        <img src={

                            el.WORK_POSITION === 'Водитель' ?
                            techs.filter(el2 => el2[3].indexOf(`${el.LAST_NAME}`) !== -1).length ? Plus : Minus :
                            techs.filter(el2 => el2[1].indexOf(`${el.LAST_NAME}`) !== -1).length ? Plus : Minus


                        }

                             alt=""
                             style={{width: 14, paddingRight: 5}}/>
                        {i+1}. {el.LAST_NAME} <span>({el.WORK_POSITION[0]}) </span><span style={{color: 'red'}}>{myTasks.filter(el2=>el2[42].indexOf(el.LAST_NAME) !== -1 ).length !== 0 ? `(${myTasks.filter(el2=>el2[42].indexOf(el.LAST_NAME) !== -1 ).length})` : null}</span></li>
                })}
            </ul>
        </div>
    );
};

export default TechList;
