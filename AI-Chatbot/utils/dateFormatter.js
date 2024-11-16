// utils/dateFormatter.js
const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = { formatDateForMySQL };