/*
 *Filename: /home/codestax/statusPage/statusPage/src/routes/organizationRouter.js *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Sunday, February 2nd 2025, 1:55:03 pm                          *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */



 const express = require('express');
 const loggingMiddleware = require('../middlewares/apiExecutionTimeMW');
 const mentorAuthMW = require('../middlewares/mentorAuthMW');
 
 const controller = require('../controllers/organizationController');
 const router = express.Router();
 // GET REQUESTS
 router.post('/', loggingMiddleware('createUser'), controller.createUser);
 router.get('/users', loggingMiddleware('getAllUserOfOrganization'), mentorAuthMW(), controller.getAllUserOfOrganization);
 router.post('/login', loggingMiddleware('loginUser'), controller.loginUser);
 router.post('/logout', loggingMiddleware('logout'), controller.logout);
 
 module.exports = router;
 