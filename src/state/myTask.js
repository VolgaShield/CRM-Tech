import {createStore, createEffect, combine, createEvent} from 'effector'
import {$myTasksNav} from "./openComment";



export const getMyTask = createEffect(async (user) => {
    const url = `getMyTask.php?user=${user}`
    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $task = createStore([]).on(
    getMyTask.doneData,
    (_, data) => data
)


export const $myTask = combine(
    $task, getMyTask.pending,$myTasksNav,
    (data, isLoading, nav) => {

        if (isLoading) {
            return []
        } else {
            return data;

        }
    }
)

export const showTaskData = createEvent();

export const $taskDataStatus = createStore(false).on(showTaskData, (_, payload) => payload)