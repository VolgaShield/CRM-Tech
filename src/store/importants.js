import {createStore, createEvent} from 'effector'

export const setImportant = createEvent('');
export const $important = createStore([]).on(setImportant, (_, payload) => payload);