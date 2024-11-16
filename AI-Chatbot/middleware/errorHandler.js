// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });

    // Handle specific types of errors
    if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({
            success: false,
            error: 'Database table not found'
        });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(500).json({
            success: false,
            error: 'Invalid database field requested'
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = { errorHandler };