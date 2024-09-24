import {createEvent, createStore} from 'effector'

export const focusSearch = createEvent();

export const $search = createStore(false).on(focusSearch, (_, payload) => payload)
