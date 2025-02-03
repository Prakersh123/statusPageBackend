/*
 *Filename: /home/codestax/statusPage/statusPage/src/routes/serviceGroupRoute.js *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2024 Trinom Digital Pvt Ltd                                    *
 */

 const express = require('express');
 const loggingMiddleware = require('../middlewares/apiExecutionTimeMW');
 const mentorAuthMW = require('../middlewares/mentorAuthMW');
 
 const controller = require('../controllers/serviceGroupController');
 const router = express.Router();
 // GET REQUESTS
 router.post('/', loggingMiddleware('createServiceGroup'), controller.createServiceGroup);
 router.put('/', loggingMiddleware('createServiceGroup'), controller.updateServiceGroup);

 router.get('/list', loggingMiddleware('getServiceGroups'), controller.getServiceGroups);
 
 
 module.exports = router;
 