import {createStore, createEffect, combine} from 'effector'
import {$nav, $typenav} from "./Nav";


export const getTechData = createEffect(async ({a, b}) => {
    const url = `getTech.php/?startDate=${a}&endDate=${b}`

    const base = 'https://volga24bot.com/kartoteka/api'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $mainReq = createStore({NEW: [], COMP: [], INJOB: []}).on(
    getTechData.doneData,
    (_, data) => data
)


export const $techStatus = combine(
    $mainReq, getTechData.pending,
    (data, isLoading) => {

        if (isLoading) {
            return {NEW: [], COMP: [], INJOB: []}
        } else {
            const newComp = data.COMP.reverse()
            return {NEW: data.NEW, COMP: newComp, INJOB: data.INJOB}
        }
    }
)
