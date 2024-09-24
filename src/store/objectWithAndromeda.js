import {createEvent, createStore} from 'effector'

export const setItems = createEvent();

export const $items = createStore([]).on(setItems, (_, payload) => payload);