import {createStore, createEffect, combine} from 'effector'



export const getTechs = createEffect(async (time) => {

    const url = `getCheck.php?time=${time}`


    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $mainReq = createStore([]).on(
    getTechs.doneData,
    (_, data) => data
)


export const $techsStatus = combine(
    $mainReq, getTechs.pending,
    (data, isLoading) => {

        if (isLoading) {
            return []
        } else {
            let supporters = []

            return data.map(el => {
                if (!supporters.includes(el[3])) {
                    supporters.push(el[3])
                    return el
                } else {
                    return [el[0], el[1], el[2], '']
                }
            })

        }
    }
)


export const getStatus = createEffect(async (time) => {
    const url = `getUserStatus.php?time=${time}`

    const base = 'https://volga24bot.com/bot'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $status = createStore([]).on(
    getStatus.doneData,
    (_, data) => data
)


export const $techStatus = combine(
    $status, getStatus.pending,
    (data, isLoading) => {

        if (isLoading) {
            return []
        } else {
            return data

        }
    }
)
