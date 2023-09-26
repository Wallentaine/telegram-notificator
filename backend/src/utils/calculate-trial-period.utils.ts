import dayjs from 'dayjs';

export const getStartUsingDate = (): string => {
    const now = dayjs();
    return now.format('YYYY-MM-DDTHH:mm:ss');
};

export const getEndOfTrialPeriodDate = (start: dayjs.Dayjs): string => {
    return start.add(15, 'day').format('YYYY-MM-DDTHH:mm:ss');
};

export const getNextDay = (date: string): string => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toDateString();
};

export const getTodayDateString = (): string => {
    const date = new Date(Date.now());
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};
