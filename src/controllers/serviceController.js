/*
 *Filename: /home/codestax/statusPage/statusPage/src/controllers/serviceController.js *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */


const { errorHandler } = require("../middlewares/errorHandlingMW");

const serviceHelper = require('../helper/serviceHelper');
class serviceController {
    createService = async (req, res) => {
        try {
            let apiData;
            let serviceGroupData;
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            apiData = await serviceHelper.isServiceExist(body, userDetails.userOrganizationID);
            if (apiData.Items.length != 0) {
                return errorHandler(400, res, req, 'Sevice already exist in system', 'SERVICE ALREADY EXIST');
            }
            serviceGroupData = await serviceHelper.getAllServiceGroup(userDetails.userOrganizationID, body.serviceGroupID)
            if (serviceGroupData.Items.length == 0) {
                return errorHandler(400, res, req, 'Sevice group does not exist', 'SERVICE GROUP NOT FOUND');
            } else {
                await serviceHelper.createService(body, userDetails.userOrganizationID);
            }

            console.log(`[${req.apiName}] SERVICE created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }

    updateService = async (req, res) => {
        try {
            let apiData;
            let serviceGroupData;
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };
            let serviceData = await serviceHelper.givenServiceIDOrgId(userDetails.userOrganizationID, body.serviceID);
            if (serviceData.Items.length == 0) {
                return errorHandler(400, res, req, 'Sevice not exist in system', 'SERVICE NOT EXIST');
            }
            if(serviceData.Items[0].serviceName != body.name) {
                apiData = await serviceHelper.isServiceExist(body, userDetails.userOrganizationID);
                if (apiData.Items.length != 0) {
                    return errorHandler(400, res, req, 'Sevice already exist in system', 'SERVICE ALREADY EXIST');
                }
            }
            
            serviceGroupData = await serviceHelper.getAllServiceGroup(userDetails.userOrganizationID, body.serviceGroupID)
            if (serviceGroupData.Items.length == 0) {
                return errorHandler(400, res, req, 'Sevice group does not exist', 'SERVICE GROUP NOT FOUND');
            } else {
                await serviceHelper.createService(body, userDetails.userOrganizationID);
            }

            console.log(`[${req.apiName}] SERVICE created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    getServices = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            const serviceGroups = {};
            let service = [];
            userDetails = {
                userOrganizationID: '12345'
            };
            const listItems = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            listItems.Items.forEach((item) => {
                if (item.sk.includes('SERVICEGROUP')) {
                    serviceGroups[item.serviceGroupID] = item;
                } else if (item.sk.includes('SERVICE#')) {
                    service.push(item);
                }
            });
            service = service.map((item) => ({
                name: item.serviceName,
                stage: {
                    label: item.stage,
                    value: item.stage,
                },
                group: {
                    label: serviceGroups[item.serviceGroupID].serviceGroupName,
                    id: item.serviceGroupID
                },
                status: item.status == 'ACTIVE' ? true : false,
                serviceID: item.serviceID

            }))
            console.log(`[${req.apiName}] Got all  Data`, listItems);
            return res.status(200).send({
                message: 'SUCCESS',
                listItems: service
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    getServicesDashboard = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            const serviceGroups = {};

            let service = [];
            userDetails = {
                userOrganizationID: '12345'
            };
            const listItems = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            listItems.Items.forEach((item) => {
                if (item.sk.includes('SERVICEGROUP')) {
                    serviceGroups[item.serviceGroupID] = item;
                    serviceGroups[item.serviceGroupID]['services'] = [];

                } else if (item.sk.includes('SERVICE#')) {
                    service.push(item);
                }
            });

            service.forEach((item) => {
                const obj = {
                    label: item.serviceName,
                    value: item.serviceID,
                    stage: {
                        value: item.stage,
                        label: item.stage
                    }
                }
                serviceGroups[item.organizationServiceGroupID.split('#')[1]].services.push(obj);
            });
            const finalAns = [];
            for (let key in serviceGroups) {
                finalAns.push({
                    services: serviceGroups[key].services,
                    serviceGroup: {
                        label: serviceGroups[key].serviceGroupName,
                        value: key
                    }
                })
            };

            console.log(`[${req.apiName}] Got all  Data`, listItems);
            return res.status(200).send({
                message: 'SUCCESS',
                listItems: finalAns
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }

}
module.exports = new serviceController();