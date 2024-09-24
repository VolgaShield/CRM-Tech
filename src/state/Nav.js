import {createEvent, createStore} from "effector";
import {setScrollY} from "./scrollY";

export const setNav = createEvent();

export const $nav = createStore('req').on(setNav, (_, payload) => {
    setScrollY(0)
    return payload
})

export const setTypeNav = createEvent();

export const $typenav = createStore('total').on(setTypeNav, (_, payload) => {
    setScrollY(0)
    return payload
})


export const setNavMyTasks = createEvent();

export const $navMyTasks = createStore('info').on(setNavMyTasks, (_, payload) => payload)