import {createEvent, createStore} from "effector";

export const setMyTasksNav = createEvent();

export const $myTasksNav = createStore('Все').on(setMyTasksNav, (_, payload) => payload)


export const setOpenComment = createEvent();

export const $openComment = createStore(false).on(setOpenComment, (_, payload) => payload)

