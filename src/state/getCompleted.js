import {createEffect, createStore} from "effector";


export const getCompleted = createEffect(async ({a, b}) => {
    const url = `getCompleted.php/?startDate=${a}&endDate=${b}`

    const base = 'https://volga24bot.com/kartoteka/api'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


export const $completed = createStore([]).on(
    getCompleted.doneData,
    (_, data) => data
)
