import {createEvent, createStore, combine, createEffect} from 'effector'

export const setUser = createEvent();

export const $user = createStore({ID: 0, UF_DEPARTMENT: [199999]}).on(setUser, (_, payload) => payload.ID === "3707" ? {...payload, UF_DEPARTMENT: [+'all']} : payload)


/**
 * Возвращает список техников своего подразделения
 */
export const getDep = createEffect(async (id) => {
    const url = `getDepForAppTech.php?id=${id}`
    const base = 'https://volga24bot.com/bot';
    const req = await fetch(`${base}/${url}`)

    return req.json()
})


const $bitrixDep = createStore([]).on(getDep.doneData, (_, payload) => payload);


export const $depStatus = combine(
    $bitrixDep, getDep.pending,
    (data, isLoading) => {
        if (isLoading) {
            return []
        } else {
            const last1 = data.pop();
            const galkin = data.pop();
            const last2 = data.pop();
            const last3 = data.pop();
            const first = data.shift();
            const kirishkin = data.shift();
            if (first !== undefined) data.push(first)
            if (last1 !== undefined) data.push(last1);
            if (last2 !== undefined) data.push(last2);
            if (last3 !== undefined) data.push(last3);
            if (kirishkin !== undefined) data.unshift(kirishkin);
            if (galkin !== undefined) data.unshift(galkin);
            return data
        }


    }

)