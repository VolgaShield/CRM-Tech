import {createStore, createEffect, combine, createEvent} from 'effector'



export const getComment = createEffect(async (id) => {
    const url = `getComments.php?id=${id}`

    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})


export const addComment = createEvent('');

const $comments = createStore([]);

$comments.on(
    getComment.doneData,
    (_, data) => data
)

$comments.on(addComment, (prev, payload) => [...prev, payload])



export const $commentsStatus = combine(
    $comments, getComment.pending,
    (data, isLoading) => {

        if (isLoading) {
            return []
        } else {
            return data;

        }
    }
)
