import {createEvent, createStore} from "effector";

export const setNav = createEvent();

export const $nav = createStore('control').on(setNav, (_, payload) => {
    return payload
})
