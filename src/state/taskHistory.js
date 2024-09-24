import {createStore, createEffect, combine} from 'effector'


export const getHistory = createEffect(async ({id}) => {
    const url = `getHistory.php/?id=${id}`

    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $history = createStore({Поставлена: [], ChangeTech: [], Брак: [], view: [], callTo: []}).on(
    getHistory.doneData,
    (_, data) => data
)


export const $historyStatus = combine(
    $history, getHistory.pending,
    (data, isLoading) => {

        if (isLoading) {
            return {Поставлена: [], ChangeTech: [], Брак: [], view: [], callTo: []}
        } else {
            return data
        }
    }
)
