/*
 *Filename: /home/codestax/statusPage/statusPage/src/routes/serviceRoute.js    *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2024 Trinom Digital Pvt Ltd                                    *
 */

 const express = require('express');
 const loggingMiddleware = require('../middlewares/apiExecutionTimeMW');
 const mentorAuthMW = require('../middlewares/mentorAuthMW');
 
 const controller = require('../controllers/serviceController');
 const router = express.Router();
 // GET REQUESTS
 router.post('/', loggingMiddleware('createService'), controller.createService);
 router.put('/', loggingMiddleware('createService'), controller.updateService);

 router.get('/list', loggingMiddleware('getServiceAPI'), controller.getServices);
 router.get('/dashboard', loggingMiddleware('getServicesDashboard'), controller.getServicesDashboard);

 
 
 module.exports = router;
 