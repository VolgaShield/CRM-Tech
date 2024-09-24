import { combine, createEffect, createEvent, createStore } from "effector";
import moment from 'moment';
import { filterDep } from "../utils/filterDepartament";
import { $user } from "./user";

export const setSelectedUser = createEvent();

export const $selectedUser = createStore(false).on(setSelectedUser, (_, payload) => payload);

export const getPlan = createEffect(async (firstTime) => {
    const url = `getAllPlanes.php?date=${moment(firstTime).format('YYYY-MM-DD')}`;
    const base = `https://volga24bot.com/kartoteka/api/tech/planing`;
    const req = await fetch(`${base}/${url}`);
    return req.json();
});

const $plan = createStore({ CURRENT: [], CHANGES: [] }).on(getPlan.doneData, (_, payload) => payload);

export const $planStatus = combine(
    $plan,
    getPlan.pending,
    $selectedUser,
    $user,
    (data2, isLoading, selected, user) => {
        if (isLoading) {
            return { CURRENT: [], CHANGES: [] };
        } else {
            let data = {
                CURRENT: data2.CURRENT.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                CHANGES: data2.CHANGES.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]))
            };
            const finish = data.CURRENT.filter(el => el[18] === 'Выполнена' || el[18] === 'Не выезжали');
            const inJob = data.CURRENT.filter(el => el[18] === 'В работе');
            const other = data.CURRENT.filter(el => el[18] !== 'В работе' && el[18] !== 'Выполнена' && el[18] !== 'Не выезжали');
            const newData = [...finish, ...inJob, ...other];
            data.CURRENT = newData;
            return data;
        }
    }
);


