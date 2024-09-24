import {createEvent, createStore} from "effector";

export const setTask = createEvent();

export const $task = createStore(null).on(setTask, (_, payload) => payload)
