// server.js
const app = require('./server-app');
const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServer running on http://0.0.0.0:${PORT}`);
});