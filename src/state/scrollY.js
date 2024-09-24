import {createEvent, createStore} from 'effector'

export const setScrollY = createEvent();

export const $scrollY = createStore(0).on(setScrollY, (_, payload) => payload)


