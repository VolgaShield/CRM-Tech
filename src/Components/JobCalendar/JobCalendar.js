import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './JobCalendar.module.scss'
import { useStore } from "effector-react";
import { $techsStatus, $techStatus, getStatus, getTechs } from "../../state/Techs";

import { $firstTime } from "../../state/graphTime";
import DateComponent from "./DatePicker";
import { $graphData, getData } from "../../state/GraphTask";

import { $openComment, setOpenComment } from "../../state/openComment";
import { $myTask, getMyTask } from "../../state/myTask";
import { $bitrixDep, $depStatus, $user, getDep } from "../../state/user";
import MyTasks from "./MyTasks";
import TechList from "./Techs/Techs";
import { TimeLine } from "./LineItem/LineItem";
import { TimeLineCommon } from './LineItem/LineItemCommon';

import { $planStatus, $selectedUser, getPlan, setSelectedUser } from "../../state/plan";

import NavTasks from "./NavTasks/NavTasks";
import { getUsers } from "../../state/getUsers";

import { $allReqStatus } from '../../state';



const JobCalendar = () => {
    const graph = useStore($graphData);
    const techs = useStore($techsStatus);
    const firstTime = useStore($firstTime);
    const openComment = useStore($openComment);
    const user = useStore($user);
    const status = useStore($techStatus);
    const dep = useStore($depStatus);
    const selected = useStore($selectedUser);
    const allReq = useStore($allReqStatus);

    useEffect(() => {
        if (user.ID !== 0) {
            getMyTask(user.ID)
        }
        getData(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

        getStatus(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

        getPlan(firstTime);

        getTechs(`${firstTime.getFullYear()}-${firstTime.getMonth() <= 8 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate() <= 9 ? '0' + (firstTime.getDate()) : firstTime.getDate()}`);

    }, [user, firstTime, dep])

    const getTextStatus = (user) => {
        const filtredData = status.filter((el) => {
            const values = Object.values(el.attendeesEntityList[0])
            return values.includes(user);
        })
        if (filtredData.length) {
            return filtredData[0].NAME
        } else {
            return null
        }
    }

    const getHelperName = (lastName, arr) => {
        let current = arr.find(el => el[3].indexOf(lastName) !== -1);
        if (current) {
            return current[1]
        } else {
            return null
        }
    }


    return (
        <div style={{ marginTop: 20 }}>{openComment ? <MyTasks customer={openComment.LAST_NAME} tasks={graph.filter(el => {
            if (openComment.WORK_POSITION === 'Водитель') {
                return el[7].indexOf(techs.find(el2 => el2[3].indexOf(openComment.LAST_NAME) !== -1) ? techs.find(el2 => el2[3].indexOf(openComment.LAST_NAME) !== -1)[1] : null) !== -1
            } else {
                return el[7].indexOf(openComment.LAST_NAME) !== -1
            }
        })} info={techs.find(el => openComment.WORK_POSITION === 'Водитель' ? el[3].indexOf(openComment.LAST_NAME) !== -1 : el[1].indexOf(openComment.LAST_NAME) !== -1)} /> : <div >
            <TechList />
            <DateComponent get={getData} func={() => { }} get2={getStatus} />
            <div className={styles.graphList}>
                {/* <div className={styles.startTimeLine}><p>9:00</p></div> */}
                <div onClick={() => selected !== setSelectedUser('Общая') ? setSelectedUser('Общая') : setSelectedUser(null)} style={selected === 'Общая' ? { background: 'rgba(0,0,0,.1)' } : null}>
                    {/* TODO: Здесь должна стоять общая */}
                    <TimeLineCommon tasks={allReq} graph={graph}/>
                </div>
                {/* <button onClick={()=>console.log(dep)}></button> */}
                {dep?.sort((a, b) => !a.WORK_POSITION.includes('Руководитель'))?.map(el2 => {
                    return (
                        <div key={el2.LAST_NAME} onClick={() => selected !== el2.LAST_NAME ? setSelectedUser(el2.LAST_NAME) : setSelectedUser(null)} style={selected === el2.LAST_NAME ? { background: 'rgba(0,0,0,.1)' } : null}>

                            <TimeLine
                                info={techs.filter(el => el2.WORK_POSITION === 'Водитель' ? el[3].indexOf(el2.LAST_NAME) !== -1 : el[1].indexOf(el2.LAST_NAME) !== -1)}
                                tasks={graph.filter(el => el2.WORK_POSITION === 'Водитель' ? el[7].indexOf(getHelperName(el2.LAST_NAME, techs)) !== -1 : el[7].indexOf(el2.LAST_NAME) !== -1)}
                                status={getTextStatus(+el2.ID)}
                                title={el2.LAST_NAME}
                            />
                        </div>
                    )
                })}
            </div>
        </div>}
            {openComment ? null : <NavTasks />}
        </div>
    );
}



export default JobCalendar;
