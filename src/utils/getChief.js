export const getLastName = (arr) => {
    if (arr.length) {
        return arr.find(el => el.WORK_POSITION?.indexOf('Начальник') !== -1 || el.WORK_POSITION?.indexOf('Руководит') !== -1)?.LAST_NAME
    } else {
        return null
    }
}