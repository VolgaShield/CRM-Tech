import {combine, createEffect, createStore} from "effector";

export const getEquipment = createEffect(async () => {
    const url = `getAllEquipment.php/`
    const base = 'https://volga24bot.com/kartoteka/api/tech/daily';
    const req = await fetch(`${base}/${url}`)
    return req.json()
})

const $equipment = createStore([]).on(getEquipment.doneData, (_, payload) => payload);

export const $equipmentStatus = combine(
    $equipment, getEquipment.pending,
    (data, isLoading) => {
        if (isLoading) {
            return null
        } else {
            return data
        }
    }
)