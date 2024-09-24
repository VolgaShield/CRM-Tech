import {createEvent, createStore} from "effector";

export const setMapNav = createEvent();

export const $mapNav = createStore('null').on(setMapNav, (_, payload) => payload)
