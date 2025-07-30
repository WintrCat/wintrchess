export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export function padDateNumber(dateNumber: number) {
    const dateNumberString = dateNumber.toString();
    return dateNumberString.length > 1 ? dateNumberString : "0" + dateNumberString;
}

export function getMonthLength(month: number) {
    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const date = new Date();
    if (date.getFullYear() % 4 == 0) {
        monthLengths[1] = 29;
    }

    return monthLengths[month - 1];
}

export function formatDate(date: Date) {
    const shortMonthName = monthNames[date.getMonth()].slice(0, 3);
    
    return `${date.getDate()} ${shortMonthName} ${date.getFullYear()}`;
}