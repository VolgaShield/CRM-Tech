import {createEvent, createStore} from "effector";

export const setLoading = createEvent();

export const $loading = createStore(false).on(setLoading, (_, payload) => payload)

