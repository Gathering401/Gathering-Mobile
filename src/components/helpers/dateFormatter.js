import { DateTime, Info } from 'luxon';

const weekdays = Info.weekdays();

export const formatDate = (repeated, repeatedDates) => {
    repeatedDates = repeatedDates.slice().sort((a,b) => DateTime.fromISO(a).get('millisecond') - DateTime.fromISO(b).get('millisecond'));
    const eventDate = DateTime.fromISO(repeatedDates.find(d =>
        DateTime.now() < DateTime.fromISO(d)
        && DateTime.fromISO(d) < DateTime.now().plus({days: 30})
    ) ?? repeatedDates[0]);
    const today = DateTime.now();

    if(eventDate.startOf('day') === today.startOf('day')) {
        return 'today';
    }

    const isThisWeek = today.endOf('week') >= eventDate;
    const isWithinNextWeek = today.endOf('week').plus({week: 1}) >= eventDate;
    const weekday = weekdays[eventDate.get('weekday') - 1];
    const isThisMonth = today.endOf('month') >= eventDate;
    const month = eventDate.get('monthLong');
    const date = getOrdinalNumberSuffix(eventDate.get('day'));
    const dateWithMonth = `${month} ${date}`;

    switch(repeated) {
        case 'weekly':
            return `${isThisWeek ? 'this' : 'next'} ${weekday}`;
        case 'biweekly':
            if(isThisWeek) {
                return `this ${weekday}`;
            }
            return `${isWithinNextWeek ? '' : 'a week from '}next ${weekday}`;
        case 'monthly':
            return isThisMonth ? `on the ${date}` : dateWithMonth;
        case 'annually':
        case 'never':
            const isThisYear = today.endOf('year') >= eventDate;
            if(isThisYear) {
                return `${dateWithMonth} this year`;
            } else {
                return `${dateWithMonth}, ${eventDate.get('year')}`;
            }
        default:
            return eventDate.toFormat('MM/dd/yyyy');
    }
}

const getOrdinalNumberSuffix = (num) => {
    let suffix = '';

    const th = 'th';
    const rd = 'rd';
    const nd = 'nd';
    const st = 'st';
  
    let lastDigit = num.toString().slice(-1);
  
    switch (lastDigit) {
        case '1': suffix = st;
        case '2': suffix = nd;
        case '3': suffix = rd;
        default:  suffix = th;
    }
  
    if (num === 11 || num === 12 || num === 13) suffix = th;

    return `${num}${suffix}`;
  }