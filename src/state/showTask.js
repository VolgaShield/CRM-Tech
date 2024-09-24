import {createEvent, createStore} from "effector";

export const setShowTask = createEvent();

export const $showTask = createStore(false).on(setShowTask, (_, payload) => payload)

