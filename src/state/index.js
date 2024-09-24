import { createStore, createEffect, combine, createEvent } from 'effector'
import { $nav, $typenav } from "./Nav";
import { filterDep } from "../utils/filterDepartament";
import { $user } from "./user";

export const getNewReq = createEffect(async ({ a, b }) => {
    console.log(a, b)
    const url = `newTasks.php/?startDate=${a}&endDate=${b}`
    const base = 'https://volga24bot.com/kartoteka/api/tech'
    const req = await fetch(`${base}/${url}`)

    return req.json()
})

const $newReq = createStore({ NEW: [], COMP: [], MOVING: [], INJOB: [], NC: [], DEFFECT: [], DEFFECT2: { NEW: [], ALL: [], COMP: [] } }).on(
    getNewReq.doneData,
    (_, data) => data
)

export const $newReqStatus = combine(
    $newReq,
    getNewReq.pending,
    $nav,
    $typenav,
    $user,
    (data2, isLoading, typeNav, nav2, user) => {
        if (isLoading) {
            return []
        } else {
            let data = {
                NEW: data2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                COMP: data2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                MOVING: data2.MOVING.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                INJOB: data2.INJOB.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                NC: data2.NC.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT: data2.DEFFECT.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT2: { NEW: data2.DEFFECT2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), ALL: data2.DEFFECT2.ALL.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), COMP: data2.DEFFECT2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), },
            }

            switch (nav2) {
                case 'total':
                    switch (typeNav) {
                        case 'so':
                            return data.NEW.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.NEW.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.NEW.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.NEW.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.NEW.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.NEW.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.NEW.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.NEW.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.NEW.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.NEW.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.NEW.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.NEW.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.NEW.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.NEW.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.NEW.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.NEW.filter(el => el[8] === '220');
                        case 'deffect':
                            return data.DEFFECT2.COMP;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                case 'COMP':
                    switch (typeNav) {
                        case 'so':
                            return data.COMP.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.COMP.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.COMP.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.COMP.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.COMP.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.COMP.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.COMP.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.COMP.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.COMP.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.COMP.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.COMP.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.COMP.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.COMP.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.COMP.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.COMP.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.COMP.filter(el => el[8] === '220');
                        case 'deffect':
                            return data.DEFFECT2.COMP;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                case 'MOVING':
                    switch (typeNav) {
                        case 'so':
                            return data.MOVING.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.MOVING.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.MOVING.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.MOVING.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.MOVING.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.MOVING.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.MOVING.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.MOVING.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.MOVING.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.MOVING.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.MOVING.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.MOVING.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.MOVING.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.MOVING.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.MOVING.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.MOVING.filter(el => el[8] === '220');
                        case 'deffect':
                            return data.DEFFECT2.MOVING;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                case 'INJOB':
                    switch (typeNav) {
                        case 'so':
                            return data.INJOB.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.INJOB.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.INJOB.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.INJOB.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.INJOB.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.INJOB.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.INJOB.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.INJOB.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.INJOB.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.INJOB.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.INJOB.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.INJOB.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.INJOB.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.INJOB.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.INJOB.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.INJOB.filter(el => el[8] === '220');
                        // case 'deffect':
                        //     return data.DEFFECT2.COMP;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                case 'NEW':
                    switch (typeNav) {
                        case 'so':
                            return data.NC.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.NC.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.NC.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.NC.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.NC.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.NC.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.NC.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.NC.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.NC.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.NC.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.NC.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.NC.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.NC.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.NC.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.NC.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.NC.filter(el => el[8] === '220');
                        case 'deffect':
                            return data.DEFFECT2.ALL;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                case 'DEFFECT':
                    switch (typeNav) {
                        case 'so':
                            return data.DEFFECT.filter(el => el[8] === 'СО');
                        case 'req':
                            return data.DEFFECT.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор');
                        case 'mon':
                            return data.DEFFECT.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение');
                        case 'dem':
                            return data.DEFFECT.filter(el => el[8] === 'Демонтаж');
                        case 'connection':
                            return data.DEFFECT.filter(el => el[3] === 'Нет контрольного события');
                        case 'repeats':
                            return data.DEFFECT.filter(el => el[3] === 'Повтор');
                        case 'pre':
                            return data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта');
                        case 'toM':
                            return data.DEFFECT.filter(el => el[13] === 'Ежемесячное ТО');
                        case 'toQ':
                            return data.DEFFECT.filter(el => el[13] === 'Ежеквартальное ТО');
                        case 'preP':
                            return data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта');
                        case 'corp':
                            return data.DEFFECT.filter(el => el[3] === 'Корпоративный');
                        case 'sp':
                            return data.DEFFECT.filter(el => el[8] === 'Снятие/Постановка');
                        case 'sh':
                            return data.DEFFECT.filter(el => el[8] === 'Шлейф');
                        case 'kts':
                            return data.DEFFECT.filter(el => el[8] === 'КТС');
                        case 'key':
                            return data.DEFFECT.filter(el => el[8] === 'Ключ');
                        case 'ddv':
                            return data.DEFFECT.filter(el => el[8] === '220');
                        case 'deffect':
                            return data.DEFFECT2.ALL;
                        default:
                            console.log('SWITCH CASE не отработал');
                            break;
                    }
                default:
                    console.log('SWITCH CASE не отработал');
                    break;
            }
        }
    }
)

export const $counters = combine(
    $newReq, getNewReq.pending, $user,
    (data2, isLoading, user) => {

        if (isLoading) {
            return { NEW: [], COMP: [], MOVING: [], INJOB: [], NC: [], DEFFECT: [] }
        } else {

            let data = {
                NEW: data2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                COMP: data2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                MOVING: data2.MOVING.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                INJOB: data2.INJOB.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                NC: data2.NC.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT: data2.DEFFECT.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])),
                DEFFECT2: { NEW: data2.DEFFECT2.NEW.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), ALL: data2.DEFFECT2.ALL.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), COMP: data2.DEFFECT2.COMP.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0])), },
            }

            const NEW = {
                req: data.NEW.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.NEW.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.NEW.filter(el => el[8] === 'Демонтаж').length,
                so: data.NEW.filter(el => el[8] === 'СО').length,
                pre: data.NEW.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.NEW.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.NEW.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.NEW.filter(el => el[3] === 'Повтор').length,
                connection: data.NEW.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.NEW.length,
                preP: data.NEW.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.NEW.filter(el => el[3] === 'Корпоративный').length,
                sp: data.NEW.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.NEW.filter(el => el[8] === 'Шлейф').length,
                kts: data.NEW.filter(el => el[8] === 'КТС').length,
                key: data.NEW.filter(el => el[8] === 'Ключ').length,
                ddv: data.NEW.filter(el => el[8] === '220').length,
            }

            const DEFFECT = {
                req: data.DEFFECT.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.DEFFECT.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.DEFFECT.filter(el => el[8] === 'Демонтаж').length,
                so: data.DEFFECT.filter(el => el[8] === 'СО').length,
                pre: data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.DEFFECT.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.DEFFECT.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.DEFFECT.filter(el => el[3] === 'Повтор').length,
                connection: data.DEFFECT.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.ALL.length,
                preP: data.DEFFECT.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.DEFFECT.filter(el => el[3] === 'Корпоративный').length,
                sp: data.DEFFECT.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.DEFFECT.filter(el => el[8] === 'Шлейф').length,
                kts: data.DEFFECT.filter(el => el[8] === 'КТС').length,
                key: data.DEFFECT.filter(el => el[8] === 'Ключ').length,
                ddv: data.DEFFECT.filter(el => el[8] === '220').length,
            }
            const NC = {
                req: data.NC.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.NC.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.NC.filter(el => el[8] === 'Демонтаж').length,
                so: data.NC.filter(el => el[8] === 'СО').length,
                pre: data.NC.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.NC.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.NC.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.NC.filter(el => el[3] === 'Повтор').length,
                connection: data.NC.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.ALL.length,
                preP: data.NC.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.NC.filter(el => el[3] === 'Корпоративный').length,
                sp: data.NC.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.NC.filter(el => el[8] === 'Шлейф').length,
                kts: data.NC.filter(el => el[8] === 'КТС').length,
                key: data.NC.filter(el => el[8] === 'Ключ').length,
                ddv: data.NC.filter(el => el[8] === '220').length,
            }
            const COMP = {
                req: data.COMP.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.COMP.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.COMP.filter(el => el[8] === 'Демонтаж').length,
                so: data.COMP.filter(el => el[8] === 'СО').length,
                pre: data.COMP.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.COMP.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.COMP.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.COMP.filter(el => el[3] === 'Повтор').length,
                connection: data.COMP.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: data.DEFFECT2.COMP.length,
                preP: data.COMP.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.COMP.filter(el => el[3] === 'Корпоративный').length,
                sp: data.COMP.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.COMP.filter(el => el[8] === 'Шлейф').length,
                kts: data.COMP.filter(el => el[8] === 'КТС').length,
                key: data.COMP.filter(el => el[8] === 'Ключ').length,
                ddv: data.COMP.filter(el => el[8] === '220').length,
            }
            const MOVING = {
                req: data.MOVING.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.MOVING.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.MOVING.filter(el => el[8] === 'Демонтаж').length,
                so: data.MOVING.filter(el => el[8] === 'СО').length,
                pre: data.MOVING.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.MOVING.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.MOVING.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.MOVING.filter(el => el[3] === 'Повтор').length,
                connection: data.MOVING.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: 0,
                preP: data.MOVING.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.MOVING.filter(el => el[3] === 'Корпоративный').length,
                sp: data.MOVING.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.MOVING.filter(el => el[8] === 'Шлейф').length,
                kts: data.MOVING.filter(el => el[8] === 'КТС').length,
                key: data.MOVING.filter(el => el[8] === 'Ключ').length,
                ddv: data.MOVING.filter(el => el[8] === '220').length,
            }
            const INJOB = {
                req: data.INJOB.filter(el => el[8] === 'Заявка' && el[3] !== 'Нет контрольного события' && el[3] !== 'Повтор').length,
                mon: data.INJOB.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.INJOB.filter(el => el[8] === 'Демонтаж').length,
                so: data.INJOB.filter(el => el[8] === 'СО').length,
                pre: data.INJOB.filter(el => el[8] === 'Претензия' && el[3] !== 'От пульта').length,
                toM: data.INJOB.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.INJOB.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.INJOB.filter(el => el[3] === 'Повтор').length,
                connection: data.INJOB.filter(el => el[3] === 'Нет контрольного события').length,
                deffect: 0,
                preP: data.INJOB.filter(el => el[8] === 'Претензия' && el[3] === 'От пульта').length,
                corp: data.INJOB.filter(el => el[3] === 'Корпоративный').length,
                sp: data.INJOB.filter(el => el[8] === 'Снятие/Постановка').length,
                sh: data.INJOB.filter(el => el[8] === 'Шлейф').length,
                kts: data.INJOB.filter(el => el[8] === 'КТС').length,
                key: data.INJOB.filter(el => el[8] === 'Ключ').length,
                ddv: data.INJOB.filter(el => el[8] === '220').length,
            }
            return { MOVING: MOVING, INJOB: INJOB, COMP: COMP, NC: NC, DEFFECT: DEFFECT, NEW: NEW }
        }
    }
)

export const getAllReq = createEffect(async () => {
    const url = `getAllReq.php/`;
    const base = 'https://volga24bot.com/kartoteka/api';
    const req = await fetch(`${base}/${url}`);

    return req.json()
});

const $allReq = createStore([]).on(
    getAllReq.doneData,
    (_, data) => data
);

export const $allReqStatus = combine(
    $allReq,
    getAllReq.pending,
    $user,
    (data, isLoading, user) => {
        if (isLoading) {
            return [];
        } else {
            return data.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]));
        }
    }
)

export const $notCompCount = combine(
    $allReq,
    getAllReq.pending,
    $user,
    (data2, isLoading, user) => {
        if (isLoading) {
            return []
        } else {
            let data = data2.filter(el => filterDep(el[4], user.UF_DEPARTMENT[0]));
            const conn = data.filter((el) => el[3] === 'Нет контрольного события');
            let numbers = [];

            return {
                req: data.filter(el => el[8] === 'Заявка').length,
                mon: data.filter(el => el[8] === 'Монтаж' || el[8] === 'Подключение').length,
                dem: data.filter(el => el[8] === 'Демонтаж').length,
                so: data.filter(el => el[8] === 'СО').length,
                pre: data.filter(el => el[8] === 'Претензия').length,
                toM: data.filter(el => el[8] === 'ТО' && el[13].indexOf('меся') !== -1).length,
                toQ: data.filter(el => el[8] === 'ТО' && el[13].indexOf('квартал') !== -1).length,
                repeats: data.filter(el => el[3] === 'Повтор').length,
                connection: conn.filter(el => {
                    if (!numbers.includes(el[1])) {
                        numbers.push(el[1])
                        return true
                    }
                }).length
            }
        }
    }
)
