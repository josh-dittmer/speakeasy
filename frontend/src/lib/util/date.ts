export function formatDate(d: Date): string {
    let hours = d.getHours();
    const s = hours < 12 ? 'am' : 'pm';

    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;

    let mdy = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    const currDate: Date = new Date();
    if (currDate.getMonth() === d.getMonth() && currDate.getFullYear() === d.getFullYear()) {
        const currDay = currDate.getDate();
        switch (d.getDate()) {
            case currDay:
                mdy = 'Today';
                break;
            case currDay - 1:
                mdy = 'Yesterday';
                break;
        }
    }

    const minutes = String(d.getMinutes()).padStart(2, '0');

    const dateStr = `${mdy} at ${hours}:${minutes}${s}`;

    return dateStr;
}
