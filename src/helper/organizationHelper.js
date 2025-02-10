/*
 *Filename: /home/codestax/statusPage/statusPage/src/helper/organizationHelper.js *
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
class orgnizationHelper {
   getUserByEmailIDPassword = async(emailID, password) => {
    const getParams = {
        TableName: process.env.ORG_TABLE,
        IndexName: 'emailID-password-index',
        KeyConditionExpression: 'emailID = :pk',
        ExpressionAttributeValues: {
            ':pk': emailID
        }
    };
    
    // Check if password is not empty and add it to the query
    if (password && password !== '') {
        getParams.KeyConditionExpression += ' AND password = :password';
        getParams.ExpressionAttributeValues[':password'] = hashOTP(password);
    }
    

    const userData = await performDDBOperation('query', db, getParams);
    return userData;
   }


   getAllUser = async(organizationID) => {
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': `ORG#${organizationID}`,
            ':sk': 'USER#'
        },
    }
    const userData = await performDDBOperation('query', db, ddbParams);
    return userData;
   }

   createUser = async (body, organizationID) => {
    const userID = uuid.v4();
    const data = {
        pk: `ORG#${organizationID}`,
        sk: `USER#${userID}`,
        name: body.name,
        emailID: body.emailID,
        password: hashOTP(body.password),
        userOrganizationID: organizationID,
        role: body.role,
        userID: userID
    };
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        Item: data
    };
    await performDDBOperation('put', db, ddbParams);
   }

   generateLoginSessionToken = async (emailID, userData) => {
    const token = jwt.sign(userData, process.env.JWT_SECRET);
    const ddbParams = {
        TableName: process.env.ORG_TABLE,
        Item: {
            pk: token,
            sk: 'SESSIONTOKEN',
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            emailID: emailID
        }
    };
    try {
        await performDDBOperation('put', db, ddbParams);
        return token;
    } catch (error) {
        console.error('Error generating session token:', error);
        throw error;
    }

    }
    getLoginSessionToken = async (token) => {
        const getParams = {
            TableName: process.env.ORG_TABLE,
            KeyConditionExpression: 'pk = :pk AND sk = :sk',
            ExpressionAttributeValues: {
                ':pk': token,
                ':sk': 'SESSIONTOKEN'
            }
        };
        const userData = await performDDBOperation('query', db, getParams);

        return userData;
    }
    deleteToken = async (token) => {
        const ddbParams = {
            TableName: process.env.ORG_TABLE,
            Key: {
                pk: token,
                sk: 'SESSIONTOKEN'
            }
        };
        const userData = await performDDBOperation('delete', db, ddbParams);
        return userData;

    }
    getAllConnectionIDOrganization = async (id) => {
        let ddbParams = {
            TableName: process.env.CONNECTION_TABLE,
            KeyConditionExpression: 'pk =:pk',
            ExpressionAttributeValues: {
                ':pk':`ORG#${id}`
            }
        }
        const apiData = await performDDBOperation('query', db, ddbParams);
        return apiData;
    }
}

module.exports = new orgnizationHelper()