/*
 *Filename: /home/codestax/statusPage/statusPage/src/helper/serviceHelper.js   *
 *Path: /home/codestax/identifyMe                                              *
 *Created Date: Sunday, February 2nd 2025, 1:27:12 pm                          *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */


const crypto = require('crypto');
const uuid = require('uuid');

const jwt = require('jsonwebtoken');
const { db } = require("../databaseLayer/DB");
const { performDDBOperation } = require("../databaseLayer/ddbOperationHelper");

function hashOTP(otp) {
    const hash = crypto.createHash('sha256');
    hash.update(otp);
    return hash.digest('hex');
}
class serviceHelper {
   createServiceGroup = async (body, organizationID) => {
    let uniqueID = uuid.v4();
    if(body.serviceGroupID) 
        uniqueID = body.serviceGroupID
    const data = {
        pk: `ORG#${organizationID}`,
        sk: `SERVICEGROUP#${uniqueID}`,
        serviceGroupName: body.name,
        serviceOrganizationID: organizationID,
        status: 'ACTIVE',
        serviceGroupID: uniqueID,
        visibility: body.visibility,
        collapsed: body.collapsed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        orgGroupUniquness: `ORGID${organizationID}#name#${body.name}`
    };
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        Item: data
    };
    await performDDBOperation('put', db, ddbParams);
   }

   

   getAllServiceGroup = async(organizationID, serviceGroupID='') => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':sk': 'SERVICEGROUP#'+serviceGroupID
        },
    }
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   }

   isServiceGroupExist = async(body, organizationID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':orgGroupUniquness': `ORGID${organizationID}#name#${body.name}`
        },
        FilterExpression: 'orgGroupUniquness =:orgGroupUniquness'
    }
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   } 


   createService = async (body, organizationID, serviceData = {logs: []}) => {
    let uniqueID = uuid.v4();
    if(body.serviceID) 
        uniqueID = body.serviceID;
    const data = {
        pk: `ORG#${organizationID}`,
        sk: `SERVICE#${uniqueID}`,
        serviceName: body.name,
        serviceOrganizationID: organizationID,
        organizationServiceGroupID: `${organizationID}#${body.serviceGroupID}`,
        status: body.status ? 'ACTIVE': 'INACTIVE',
        serviceGroupID: body.serviceGroupID,
        serviceID: uniqueID,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        orgServiceUniquness: `ORGID${organizationID}#name#${body.name}`,
        stage: body.stage,
        description: body.description,
        logs: []
    };
    if (serviceData && serviceData.stage != body.stage) {
        data.logs = serviceData.logs;
        data.logs.push({
            key: body.stage,
            timeStamp: Date.now()
        })
    } 
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        Item: data
    };
    await performDDBOperation('put', db, ddbParams);
   }

   isServiceExist = async(body, organizationID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':orgServiceUniquness': `ORGID${organizationID}#name#${body.name}`
        },
        FilterExpression: 'orgServiceUniquness =:orgServiceUniquness'
    }
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   } 
   givenOrgServiceGroupGetServices = async(serviceGroupID, organizationID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        IndexName: 'organizationServiceGroupID-stage-index',
        KeyConditionExpression: 'organizationServiceGroupID = :pk',
        ExpressionAttributeValues: {
            ':pk': `${organizationID}#${serviceGroupID}`
        }
    };
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   }
   givenOrgGetServices = async(organizationID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':sk': 'SERVICE'
        }
    };
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   }
   givenServiceIDOrgId = async(organizationID, serviceID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk and sk =:sk',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':sk': `SERVICE#${serviceID}`
        }
    };
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   }
}

module.exports = new serviceHelper()