import {combine, createEffect, createEvent, createStore} from "effector";
import {$user} from "./user";
import {filterDep} from "../utils/filterDepartament";

export const setSearch = createEvent();
export const $search = createStore(false).on(setSearch, (_, payload) => payload)

export const setSearchInput = createEvent();
export const $searchInput = createStore('').on(setSearchInput, (_, payload) => payload)

export const getReq = createEffect(async () => {
    let a = null;
    let b = null;
    const url = `getTasks.php/?startDate=${a}&endDate=${b}`
    const base = 'https://volga24bot.com/kartoteka/api/tech';
    const req = await fetch(`${base}/${url}`)
    return req.json()

})

export const setCheckBox = createEvent();
export const $checkBox = createStore(false).on(setCheckBox, (_, payload) => payload)


export const setSplice = createEvent();
export const $splice = createStore(100).on(setSplice, (prevState, payload) => prevState + payload)

const $req = createStore([]).on(
    getReq.doneData,
    (_, data) => data
)


export const $reqStatus = combine(
    $req, getReq.pending, $searchInput, $user, $checkBox, $splice,
    (data2, isLoading, input, user, checkbox, splice) => {
        if (isLoading) {
            return []
        } else {
            let data = data2.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]));
            let newData;
            if (checkbox) {
                newData = data.filter(el => el[37] === user.ID)
            } else {
                newData = data
            }
            const search = input.split(' ');
            const searchData = (g, h, a, b, c, d, e, f) => {

                let error = false;
                search.forEach(el => {
                    if (el !== '') {
                        if (a.indexOf(el.toLowerCase()) === -1
                            && b.indexOf(el.toLowerCase()) === -1
                            && c.indexOf(el.toLowerCase()) === -1
                            && d.indexOf(el.toLowerCase()) === -1
                            && g.indexOf(el.toLowerCase()) === -1
                            && e.indexOf(el.toLowerCase()) === -1
                            && h.indexOf(el.toLowerCase()) === -1
                            && f.indexOf(el.toLowerCase()) === -1) {
                            error = true;
                        }
                    }
                })
                return !error
            }
            return newData.filter(el => searchData(el[47].toLowerCase(), el[1], el[2].toLowerCase(), el[4].toLowerCase(), el[13].toLowerCase(), el[8].toLowerCase(), el[18].toLowerCase(), el[40].toLowerCase()))//.splice(0, splice)
        }
    }
)


export const setFilterReq = createEvent('')
export const setFilterReq2 = createEvent('')
export const $filterReq = createStore('0').on(setFilterReq, (_, payload) => payload)
export const $filterReq2 = createStore('-1').on(setFilterReq2, (_, payload) => payload)

export const $filtredReq = combine(
    $req, $filterReq, $filterReq2, (data, filter, filter2) => {
        if (filter !== '0') {
            return data.filter(el => el[1] === filter || el[4] === filter2)
        } else {
            return data.filter(el => el[4] === filter2)
        }
    });