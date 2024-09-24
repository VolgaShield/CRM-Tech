export const getLastName = (names) => {
    const arrNames = names.split(',').join(' ').split(' ')

    let title = []

    for (let i = 0; i < arrNames.length; i+=3) {
        title.push(arrNames[i])
    }

    return title.join(', ')
}