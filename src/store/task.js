import {createEvent, createStore} from 'effector'


export const setTask = createEvent();


export const updateTask = createEvent();
export const updateHistory = createEvent();



export const $task = createStore(null)
$task.on(updateTask, (prev, payload) => {

    prev[5] = payload.time
    prev[7] = payload.user
    prev[18] = 'В работе'
    const next = [...prev]

    return next
});


$task.on(updateHistory, (prev, payload) => {

    prev[50] = payload
    const next = [...prev]

    return next
});


$task.on(setTask, (_, payload) => payload);



