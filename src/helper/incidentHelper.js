/*
 *Filename: /home/codestax/statusPage/statusPage/src/helper/incidentHelper.js  *
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
class incidentHelper {

   createIncident = async (body, organizationID, existingData = {}) => {
    let uniqueID = uuid.v4();
    if(body.incidentID) 
        uniqueID = body.incidentID;
    const data = {
        pk: `ORG#${organizationID}`,
        sk: `SERVICEINCIDENT#${uniqueID}`,
        incidentName: body.name,
        incidentOrganizationID: organizationID,
        currentStage: body.stage,
        incidentID: uniqueID,
        serviceID: body.serviceID,        
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: body.description,
        updates:[{
            stage: body.stage,
            performedAt: body.dateTimeValue,
            comment: body.comments || ''
        }],
        status: 'ACTIVE'
    };
    if(body.incidentID && existingData.currentStage != body.stage) {
        data.updates = existingData.updates;
        data.updates.push({
            stage: body.stage,
            performedAt: body.dateTimeValue || '',
            comment: body.comments || ''
        })
    }
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        Item: data
    };
    await performDDBOperation('put', db, ddbParams);
    return data;
   }

   getIncidentGivenID = async(organizationID, incidentID='') => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':sk': 'SERVICEINCIDENT#'+incidentID
        },
    }
    const apiData = await performDDBOperation('query', db, ddbParams);
    return apiData;
   }
}

module.exports = new incidentHelper()