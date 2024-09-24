import {combine, createEffect, createStore} from "effector";

export const getData = createEffect(async id => {
    if (id === 0) {
        return []
    }

    const url = `getData.php/?id=${id}`
    const base = 'https://volga24bot.com/kartoteka/api'
    const req = await fetch(`${base}/${url}`)
    return req.json()

})


const $data = createStore({'ID': 0, "Customers" : [], "Zones": [], 'ev': []}).on(
    getData.doneData,
    (_, data) => data
)

export const $status = combine(
    $data, getData.pending,
    (data, isLoading) => isLoading
        ? {'ID': 0, "Customers" : [], "Zones": [], 'ev': []}
        : data
)
