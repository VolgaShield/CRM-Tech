import {createEvent, createStore} from 'effector'
import {getTechs} from "./Techs";

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

export const firstTimeAdd = createEvent();
export const firstTimeDelete = createEvent();

const $firstTime = createStore( new Date())


$firstTime.on(changeFirstTime, (_, payload) => payload);

$firstTime.on(firstTimeAdd, (prevState, payload) => {
    return prevState.addDays(1);
});

$firstTime.on(firstTimeDelete, (prevState, payload) => {
    return prevState.deleteDays(1)
});


export {$firstTime};

