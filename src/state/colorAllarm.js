import {createEvent, createStore} from "effector";

export const setAllarm = createEvent();

export const $allarm = createStore('green').on(setAllarm, (_, payload) => payload)