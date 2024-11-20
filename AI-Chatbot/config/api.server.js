// config/api.server.js
const LOCAL_IP = '10.0.0.0';
const PORT = '3000';

const API_URL = `http://${LOCAL_IP}:${PORT}/api`;

module.exports = {
    API_URL,
    PORT,
    LOCAL_IP
};