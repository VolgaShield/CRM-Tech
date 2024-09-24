import {createEvent, createStore} from "effector";

export const setCreateTask = createEvent();

export const $createTask= createStore(false).on(setCreateTask, (_, payload) => payload)

