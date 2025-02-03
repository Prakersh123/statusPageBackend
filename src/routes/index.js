
const serviceGroupRoute = require('./serviceGroupRoute');
const serviceRoute = require('./serviceRoute');
const organizationRouter = require('./organizationRouter');
const incidentRoute = require('./incidentRoute');
module.exports = function (app) {
    app.use('/api/v1/service-group', serviceGroupRoute);
    app.use('/api/v1/service', serviceRoute);
    app.use('/api/v1/user', organizationRouter);
    app.use('/api/v1/incident', incidentRoute);
};
