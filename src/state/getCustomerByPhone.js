import {createEffect, createStore, combine, createEvent} from "effector";




export const getCustomer = createEffect(async (phone) => {
    const url = `getCustByPhone.php/?phone=${phone}`

    const base = 'https://volga24bot.com/andromeda'
    const req = await fetch(`${base}/${url}`)

    return req.json()

})

export const setCustomer = createEvent('')

const $customer = createStore([])

$customer.on(
    getCustomer.doneData,
    (_, data) => data
)
$customer.on(
    setCustomer,
    (_, payload) => payload
)


export const $customerStatus = combine(
    $customer, getCustomer.pending,
    (data, isLoading) => {

        if (isLoading) {
            return 'loading'
        } else {
            return data

        }
    }
)
