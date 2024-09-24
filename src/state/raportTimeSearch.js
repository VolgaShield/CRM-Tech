import {createEvent, createStore} from 'effector'

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.deleteDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

export const changeFirstTime = createEvent();
export const changeSecondTime = createEvent();
export const firstTimeAdd = createEvent();
export const firstTimeDelete = createEvent();

const $firstTime = createStore( new Date())
const $secondTime = createStore(new Date().addDays(1))

$firstTime.on(changeFirstTime, (_, payload) => payload);
$secondTime.on(changeSecondTime, (_, payload) => payload);
$firstTime.on(firstTimeAdd, (prevState, payload) => prevState.addDays(1));
$secondTime.on(firstTimeAdd, (prevState, payload) => prevState.addDays(1));
$firstTime.on(firstTimeDelete, (prevState, payload) => prevState.deleteDays(1));
$secondTime.on(firstTimeDelete, (prevState, payload) => prevState.deleteDays(1));


export {$firstTime, $secondTime};

