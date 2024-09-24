import {createStore, createEffect, combine} from 'effector'



export const getData = createEffect(async (date) => {
    const url = `getTimeJobGraph.php?date=${date}`

    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


const $graph = createStore([]).on(
    getData.doneData,
    (_, data) => data
)


export const $graphData = combine(
    $graph, getData.pending,
    (data, isLoading) => {

        if (isLoading) {
            return []
        } else {
            return data.sort(function(a,b){
                return new Date(a[5].replace(' ', 'T')) - new Date(b[5].replace(' ', 'T'));
            });

        }
    }
)
