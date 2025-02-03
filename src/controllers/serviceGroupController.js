/*
 *Filename: /home/codestax/statusPage/statusPage/src/controllers/serviceGroupController.js *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */




const { errorHandler } = require("../middlewares/errorHandlingMW");
const serviceHelper = require('../helper/serviceHelper');
class serviceGroupController {
    createServiceGroup = async (req, res) => {
        try {
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            let apiData;
            apiData = await serviceHelper.isServiceGroupExist(body, userDetails.userOrganizationID);
            if (apiData.Items.length == 0) {
                await serviceHelper.createServiceGroup(body, userDetails.userOrganizationID);
            } else {
                return errorHandler(400, res, req, 'Group already exist in system', 'GROUP ALREADY EXIST');
            }
            console.log(`[${req.apiName}] Group created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    updateServiceGroup = async (req, res) => {
        try {
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            let apiData={};
            let serviceData = await serviceHelper.getAllServiceGroup(userDetails.userOrganizationID, body.serviceGroupID);
    
            if (serviceData.Items.length == 0) {
                return errorHandler(400, res, req, 'Sevice group not exist in system', 'SERVICE  GROUP NOT EXIST');
            }
            if(serviceData.Items[0].serviceGroupName != body.name) {
                apiData = await serviceHelper.isServiceGroupExist(body, userDetails.userOrganizationID);
            } else {
                apiData['Items'] = []; 
            }
            if (apiData.Items.length == 0) {
                await serviceHelper.createServiceGroup(body, userDetails.userOrganizationID);
            } else {
                return errorHandler(400, res, req, 'Group already exist in system', 'GROUP ALREADY EXIST');
            }
            console.log(`[${req.apiName}] Group created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    getServiceGroups = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            const listItems = await serviceHelper.getAllServiceGroup(userDetails.userOrganizationID);
            console.log(`[${req.apiName}] Got all  Data`, listItems);
            return res.status(200).send({
                message: 'SUCCESS',
                listItems: listItems.Items || []
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }

}
module.exports = new serviceGroupController();