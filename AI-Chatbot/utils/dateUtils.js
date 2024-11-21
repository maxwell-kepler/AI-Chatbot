// utils/dateUtils.js
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();

    const messageDate = date.toLocaleDateString();
    const nowDate = now.toLocaleDateString();

    if (messageDate === nowDate) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const getCurrentTime = () => {
    const now = new Date();
    return formatDateForMySQL(now);
};

export const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    return date.toLocaleDateString() === now.toLocaleDateString();
};

export const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = Math.abs(end - start);

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};