// server.js
const app = require('./server-app');
const { PORT, LOCAL_IP } = require('./config/api.server');

app.listen(PORT, LOCAL_IP, () => {
    console.log(`\nServer running on http://${LOCAL_IP}:${PORT}`);
});