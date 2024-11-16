// middleware/requestLogger.js
const requestLogger = (req, res, next) => {
    console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

module.exports = { requestLogger };