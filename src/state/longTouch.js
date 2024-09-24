import {createStore, createEvent} from 'effector'

export const setLongtouch = createEvent('Фильтрация');
export const $longTouch = createStore(false).on(setLongtouch, (_, payload) => payload);


export const setSelected = createEvent();
export const selectAll = createEvent();
export const deleteSelected = createEvent();
export const cleareSelected = createEvent();
export const $selected = createStore([]);
$selected.on(setSelected, (prev, payload) => [...prev, payload]);
$selected.on(deleteSelected, (prev, payload) => {
    return prev.filter(el => el !== payload)
});

$selected.on(cleareSelected, (_, payload) => []);
$selected.on(selectAll, (_, payload) => payload);
