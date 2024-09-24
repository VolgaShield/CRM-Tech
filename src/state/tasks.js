import {createEvent, createStore} from 'effector'

export const setToday = createEvent();

export const $today = createStore([]).on(setToday, (_, payload) => payload)


