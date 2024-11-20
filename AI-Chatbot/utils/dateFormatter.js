// utils/dateFormatter.js
const TIMEZONE = 'America/Denver';

const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: TIMEZONE
    }).replace(/(\d+)\/(\d+)\/(\d+),\s+/, '$3-$1-$2 ');
};

const formatDisplayDateTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: TIMEZONE
    });
};

const getCurrentTime = () => {
    return formatDateForMySQL(new Date());
};

module.exports = {
    formatDateForMySQL,
    formatDisplayDateTime,
    getCurrentTime,
    TIMEZONE
};