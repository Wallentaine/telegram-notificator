    const maxHourNum = 23;
    const maxHourStr = '23';
    const minHourNum = -23;
    const minHourStr = '-23';
    const maxMinuteNum = 59;
    const maxMinuteStr = '59';
    const minMinuteNum = -59;
    const minMinuteStr = '-59';

    export const validateHour = (value: string): string => {
        const numValue = Number(value);
        if (numValue < 0) {
            return numValue >= minHourNum ? value : minHourStr;
        }
        if (numValue > 0) {
            return numValue <= maxHourNum ? value : maxHourStr;
        }
        return value;
    }

    export const validateMinute = (value: string): string => {
        const numValue = Number(value);
        if (numValue < 0) {
            return numValue >= minMinuteNum ? value : minMinuteStr;
        }
        if (numValue > 0) {
            return numValue <= maxMinuteNum ? value : maxMinuteStr;
        }
        return value;
    }

    export const validateHourPositive = (value: string): string => {
        const numValue = Number(value);
        if (numValue < 0) {
            return '0';
        }
        return numValue > maxHourNum ? maxHourStr : value;
    }

    export const validateMinutePositive = (value: string): string => {
        const numValue = Number(value);
        if (numValue < 0) {
            return '0';
        }
        return numValue > maxMinuteNum ? maxMinuteStr : value;
    }