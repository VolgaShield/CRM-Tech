export const getHistoryType = (el) => {
    if (el.type === 'call') {
        return 'Созвонился'
    } else if (el.type === 'start') {
        return  'В работе'
    } else if (el.type === 'comment') {
        return `${el.user.split(' ')[0]} - ${el.value}`
    }  else if (el.type === 'finish') {
        return 'Завершил работу - '+el.value
    } else if (el.type === 'changeTech') {
        return `Смена исполнителя`
    } else if (el.type === 'view') {
      if (el.user === 'undefined undefined undefined')
        return `Прочитана`;
      return `Прочитана ${el.user.split(' ')[0]}`;
    } else if (el.type === 'plane_change') {
        return el.value;
    } else if (el.type === 'retry') {
        return 'Возобновлена - ' + el.value;
    }
}