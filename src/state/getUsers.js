import {combine, createEffect, createStore} from "effector";

/**
 * Возврат массива объектов со всех подразделений, с начальником подразделения,
 * с сотрудниками и id подразделения
 */
export const getUsers = createEffect(async () => {
    const url = `getFlyShietCity.php/`
    const base = 'https://volga24bot.com/bot';
    const req = await fetch(`${base}/${url}`)
    return req.json()
})


const $users = createStore([]).on(getUsers.doneData, (_, payload) => payload);


export const $usersStatus = combine(
    $users, getUsers.pending,
    (data, isLoading) => {
        if (isLoading) {
            return []
        } else {
            return data
        }
    }
)