/*
 *Filename: /home/codestax/statusPage/statusPage/src/controllers/incidentController.js *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Saturday, December 14th 2024, 6:47:42 pm                       *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */



const { errorHandler } = require("../middlewares/errorHandlingMW");
const serviceHelper = require('../helper/serviceHelper');
const incidentHelper = require('../helper/incidentHelper');
const organizationHelper = require("../helper/organizationHelper");
const { pushToClient } = require("../helper/websocketHelper");

class incidentController {
    createIncident = async (req, res) => {
        try {
            let apiData;
            let serviceGroupData = {};
            let serviceFound;
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };

            apiData = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            if (body.serviceID) {
                serviceFound = apiData.Items.filter((item) => {

                    if (item.sk.includes('SERVICE#') && item.serviceID == body.serviceID) return true;
                    if (item.sk.includes('SERVICEGROUP#')) {
                        serviceGroupData[item.serviceGroupID] = item;
                    }
                    return false;
                })
                if (apiData.Items.length == 0 || serviceFound.length == 0 || serviceFound.length != 1 || !(serviceFound[0].serviceGroupID in serviceGroupData)) {
                    return errorHandler(400, res, req, 'Sevice not exist', 'SERVICE NOT EXIST, BAD REQUEST');
                }

            } else {
                body['serviceID'] = '';
            }



            let finalData = await incidentHelper.createIncident(body, userDetails.userOrganizationID)
            try {
                const connections =  await organizationHelper.getAllConnectionIDOrganization(userDetails.userOrganizationID);
                let allPushPromise = connections.Items.map(async (item) => {
                 await pushToClient('', item.sk, {
                     'type': 'INCIDENT_UPDATE',
                     'incidentData': {
                        incidentName: finalData.incidentName,
                        id: finalData.incidentID,
                        currentStage: {
                            label: finalData.currentStage,
                            value: finalData.currentStage,
                        },
                        serviceGroup: {
                            label: finalData.serviceID ? serviceGroupData[serviceFound[0].serviceGroupID].serviceGroupName : "",
                            value: finalData.serviceID ? serviceFound[0].serviceGroupID : "",
                        },
                        service: {
                            label: finalData.serviceID ? serviceFound[0].serviceName : "",
                            value: finalData.serviceID || "",
                        },
                        updateList: finalData.updates.map((x)=>(
                            {
                                stageLabel: x.stage,
                                stageValue: x.stage,
                                comment: x.comment,
                                dateValue: x.performedAt
                            }
                        )),
                        createdAt: finalData.createdAt,
                        updatedAt: finalData.updatedAt,
                        description: finalData.description
                    }
                            
                 });
             });
             let promiseResponse = await Promise.allSettled(allPushPromise);
             console.log(promiseResponse);
             } catch(error) {
                 console.log('Error in websocket', error);
             }
            console.log(`[${req.apiName}] SERVICE created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    updateIncident = async (req, res) => {
        try {
            let apiData;
            let serviceGroupData = {};
            let serviceFound;
            let body = req.body;
            console.log(req.body);
            let userDetails = req.userDetails;
            userDetails = {
                userOrganizationID: '12345'
            };

            let incidentData = await incidentHelper.getIncidentGivenID(userDetails.userOrganizationID, body.incidentID);
            if (incidentData.Items.length == 0) {
                return errorHandler(400, res, req, 'Incident not exist in system', 'INCIDENT NOT EXIST');
            }
            apiData = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            if (body.serviceID) {
                serviceFound = apiData.Items.filter((item) => {

                    if (item.sk.includes('SERVICE#') && item.serviceID == body.serviceID) return true;
                    if (item.sk.includes('SERVICEGROUP#')) {
                        serviceGroupData[item.serviceGroupID] = item;
                    }
                    return false;
                })
                if (apiData.Items.length == 0 || serviceFound.length == 0 || serviceFound.length != 1 || !(serviceFound[0].serviceGroupID in serviceGroupData)) {
                    return errorHandler(400, res, req, 'Sevice not exist', 'SERVICE NOT EXIST, BAD REQUEST');
                }

            } else {
                body['serviceID'] = '';
            }



            let finalData = await incidentHelper.createIncident(body, userDetails.userOrganizationID, incidentData.Items[0])
            try {
                const connections =  await organizationHelper.getAllConnectionIDOrganization(userDetails.userOrganizationID);
                let allPushPromise = connections.Items.map(async (item) => {
                 await pushToClient('', item.sk, {
                     'type': 'INCIDENT_UPDATE',
                     'incidentData': {
                        incidentName: finalData.incidentName,
                        id: finalData.incidentID,
                        currentStage: {
                            label: finalData.currentStage,
                            value: finalData.currentStage,
                        },
                        serviceGroup: {
                            label: finalData.serviceID ? serviceGroupData[serviceFound[0].serviceGroupID].serviceGroupName : "",
                            value: finalData.serviceID ? serviceFound[0].serviceGroupID : "",
                        },
                        service: {
                            label: finalData.serviceID ? serviceFound[0].serviceName : "",
                            value: finalData.serviceID || "",
                        },
                        updateList: finalData.updates.map((x)=>(
                            {
                                stageLabel: x.stage,
                                stageValue: x.stage,
                                comment: x.comment,
                                dateValue: x.performedAt
                            }
                        )),
                        createdAt: finalData.createdAt,
                        updatedAt: finalData.updatedAt,
                        description: finalData.description
                    }
                            
                 });
             });
             let promiseResponse = await Promise.allSettled(allPushPromise);
             console.log(promiseResponse);
             } catch(error) {
                 console.log('Error in websocket', error);
             }
            console.log(`[${req.apiName}] SERVICE created Successfuly`);
            return res.status(200).send({
                message: 'SUCCESS'
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }
    getIncidents = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            const serviceGroups = {};
            let serviceMap = [];
            let incidents = [];
            userDetails = {
                userOrganizationID: '12345'
            };
            const listItems = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            listItems.Items.forEach((item) => {
                if (item.sk.includes('SERVICEGROUP#')) {
                    serviceGroups[item.serviceGroupID] = item;
                } else if (item.sk.includes('SERVICE#')) {
                    serviceMap[item.serviceID] = item;
                } else {
                    incidents.push(item);
                }
            });
            incidents = incidents.map((item) => ({
                name: item.incidentName,
                incidentID: item.incidentID,
                currentStage: {
                    label: item.currentStage,
                    value: item.currentStage,
                },
                serviceGroup: {
                    label: item.serviceID ? serviceGroups[serviceMap[item.serviceID].serviceGroupID].serviceGroupName : "",
                    value: item.serviceID ? serviceMap[item.serviceID].serviceGroupID : "",
                },
                service: {
                    label: item.serviceID ? serviceMap[item.serviceID].serviceName : "",
                    value: item.serviceID || "",
                },
                updates: item.updates,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                description: item.description

            }))
            console.log(`[${req.apiName}] Got all  Data`, listItems);
            return res.status(200).send({
                message: 'SUCCESS',
                listItems: incidents
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

                } else {
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
    getIncidentsDashboard = async (req, res) => {
        try {
            let userDetails = req.userDetails;
            const serviceGroups = {};
            let serviceMap = [];
            let incidents = [];
            userDetails = {
                userOrganizationID: '12345'
            };
            const listItems = await serviceHelper.givenOrgGetServices(userDetails.userOrganizationID);
            listItems.Items.forEach((item) => {
                if (item.sk.includes('SERVICEGROUP#')) {
                    serviceGroups[item.serviceGroupID] = item;
                } else if (item.sk.includes('SERVICE#')) {
                    serviceMap[item.serviceID] = item;
                } else {
                    incidents.push(item);
                }
            });
            incidents = incidents.map((item) => ({
                incidentName: item.incidentName,
                id: item.incidentID,
                currentStage: {
                    label: item.currentStage,
                    value: item.currentStage,
                },
                serviceGroup: {
                    label: item.serviceID ? serviceGroups[serviceMap[item.serviceID].serviceGroupID].serviceGroupName : "",
                    value: item.serviceID ? serviceMap[item.serviceID].serviceGroupID : "",
                },
                service: {
                    label: item.serviceID ? serviceMap[item.serviceID].serviceName : "",
                    value: item.serviceID || "",
                },
                updateList: item.updates.map((x)=>(
                    {
                        stageLabel: x.stage,
                        stageValue: x.stage,
                        comment: x.comment,
                        dateValue: x.performedAt
                    }
                )),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                description: item.description

            }))
            console.log(`[${req.apiName}] Got all  Data`, listItems);
            return res.status(200).send({
                message: 'SUCCESS',
                listItems: incidents
            });

        } catch (error) {
            return errorHandler(500, res, req, 'OUTERMOST CATCH TRIGGERED', 'SOMETHIGN WENT WRONG', error);
        }
    }

}
module.exports = new incidentController();