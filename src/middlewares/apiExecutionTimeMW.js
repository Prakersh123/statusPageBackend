

function loggingMiddleware(apiName) {
    return (req, res, next) => {
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const apiEntryTime = new Date();
        const successStatusCodes = [200, 201, 204];
        console.log(`[TIMEINFO][${apiName}] Entry time for ${apiName} API`, new Intl.DateTimeFormat('en-IN', options).format(new Date(apiEntryTime)));
        req.apiName = apiName;
        res.on('finish', () => {
            const apiExitTime = new Date();
            const executionTime = apiExitTime - apiEntryTime;
            const apiStatus = successStatusCodes.includes(res.statusCode) ? 'SUCCESS' : 'ERROR';
            console.log(`[TIMEINFO][${apiName}][${apiStatus}] ${apiStatus} Execution time: ${executionTime}ms`);
        });
        next();
    };
}

module.exports = loggingMiddleware;
