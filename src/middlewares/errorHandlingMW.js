
function errorHandler(status, res, req, consoleErrorMessage = '', responseErrorMessage = '', ERROR = '') {
    const defaultMessage = 'Something went wrong';
    const apiName = req.apiName || req.originalURL;
    const errorMessages = {
        400: responseErrorMessage || 'Bad Request',
        401: 'Unauthorized - Access Denied',
        403: 'Forbidden - Access Denied',
        404: responseErrorMessage || 'Resource Not Found',
        500: responseErrorMessage || 'Internal Server Error',
        429: responseErrorMessage || 'Too Many Attempt'
    };

    const errorResponse = {
        message: errorMessages[status] || defaultMessage,
    };
    console.log(`[ERROR][${apiName}]`, consoleErrorMessage, ERROR);
    res.status(status).send(errorResponse);
}

module.exports = {
    errorHandler,
};
