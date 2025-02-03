
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Manually set AWS credentials
const config = {
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: 'ap-south-1',  
};

const db = new DynamoDBClient(config);

module.exports = { db };
