/**
 * @param {Date} date 
 * @param {string} time 
 * @returns Отформатированная дата со временем
 */
const formatDateTime = (date, time = '00:00:00') => {
    const year = 4,
          month = 2,
          day = 0;

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }

    const formatter = new Intl.DateTimeFormat('ru-RU', options);
    const parts = formatter.formatToParts(date);
    return `${parts[year].value}-${parts[month].value}-${parts[day].value} ${time}`;
}


export default formatDateTime;