/*
 *Filename: /home/codestax/statusPage/statusPage/src/controllers/organizationController.js *
 *Path: /home/codestax/statusPage/statusPage                                   *
 *Created Date: Sunday, February 2nd 2025, 6:52:39 pm                          *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */



const { errorHandler } = require("../middlewares/errorHandlingMW");




const organizationHelper = require('../helper/organizationHelper');




class orgnaizationController {
    createUser = async (req, res) => {
        try {
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            let newUserData;
            newUserData = await organizationHelper.getUserByEmailIDPassword(body.emailID, '');
            if (newUserData.Items.length == 0) {
                await organizationHelper.createUser(body, userDetails.userOrganizationID);
            } else {
                return errorHandler(400, res, req, 'User already exist in system', 'USER ALREADY EXIST WITH THIS EMAIL');
            }
            console.log(`[${req.apiName}] User created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }

    getAllUserOfOrganization = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            const userList = await organizationHelper.getAllUser(userDetails.userOrganizationID);
            console.log(`[${req.apiName}] Got all user Data`, userList);
            return res.status(200).send({
                message: 'SUCCESS',
                userList: userList.Items || []
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    loginUser = async (req, res) => {
        try {
            let body = req.body;
            console.log(req.body);

            let UserData;
            let token
            UserData = await organizationHelper.getUserByEmailIDPassword(body.emailID, body.password);
            if (UserData.Items.length == 0) {
                return errorHandler(400, res, req, 'User not exist in system', 'USER NOT EXIST WITH THIS EMAIL');
            }
            console.log(`[${req.apiName}] User get Successfuly`);
            UserData = UserData.Items[0];
            token = await organizationHelper.generateLoginSessionToken(req.body.emailID, {
                userID: UserData.userID,
                emailID: UserData.emailID,
            });
            return res.status(200).send({
                message: 'SUCCESS',
                token,
                userType: UserData.role
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    logout = async (req, res) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return errorHandler(400, res, req, 'Token not provided', 'BAD REQUEST');
            }
            await organizationHelper.deleteToken(token);

            return res.status(200).send({ message: 'Logout successful' });
        } catch (error) {
            return errorHandler(500, res, req, 'Internal Server Error', 'INTERNAL SERVER ERROR', error);
        }
    };
 
    
    



}
module.exports = new orgnaizationController();