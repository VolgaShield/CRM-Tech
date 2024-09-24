import {createStore, createEffect, combine} from 'effector'

export const getData = createEffect(async id => {
    if (id === 0) {
        return []
    }

    const url = `getData.php/?id=${id}`
    const base = 'https://volga24bot.com/kartoteka/api'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $data = createStore([]).on(
    getData.doneData,
    (_, data) => data
)

export const $status = combine(
    $data, getData.pending,
    (data, isLoading) => isLoading
        ? false
        : data
)
