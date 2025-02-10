/*
 *Filename: /home/codestax/statusPage/statusPage/src/routes/incidentRoute.js   *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2024 Trinom Digital Pvt Ltd                                    *
 */

const express = require('express');
const loggingMiddleware = require('../middlewares/apiExecutionTimeMW');
const mentorAuthMW = require('../middlewares/mentorAuthMW');

const controller = require('../controllers/incidentController');
const router = express.Router();
// GET REQUESTS
router.post('/', loggingMiddleware('createIncident'), mentorAuthMW(), controller.createIncident);
router.put('/', loggingMiddleware('updateIncident'), mentorAuthMW(), controller.updateIncident);

router.get('/list', loggingMiddleware('getIncidents'), mentorAuthMW(), controller.getIncidents);
router.get('/dashboardv2', loggingMiddleware('getIncidentsDashboard'), controller.getIncidentsDashboard);

router.get('/dashboard', loggingMiddleware('getIncidentsDashboard'), mentorAuthMW(), controller.getIncidentsDashboard);




module.exports = router;
