const {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    BatchWriteItemCommand,
    BatchGetItemCommand,
    TransactWriteItemsCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

async function performDDBOperation(operationType, dbClient, dbParams) {
    try {
        let command;

        // Prepare marshalling for specific operations
        if (['put', 'update', 'delete'].includes(operationType)) {
            if (dbParams.Item) {
                dbParams.Item = marshall(dbParams.Item);
            }
            if (dbParams.Key) {
                dbParams.Key = marshall(dbParams.Key);
            }
        }
        if (operationType === 'batchwrite') {
            // Marshal the request items for BatchWriteItem operation
            if (dbParams.RequestItems) {
                Object.keys(dbParams.RequestItems).forEach((tableName) => {
                    dbParams.RequestItems[tableName] = dbParams.RequestItems[tableName].map((request) => {
                        const newRequest = {};
                        if (request.PutRequest && request.PutRequest.Item) {
                            newRequest.PutRequest = {
                                Item: marshall(request.PutRequest.Item),
                            };
                        } else if (request.DeleteRequest && request.DeleteRequest.Key) {
                            newRequest.DeleteRequest = {
                                Key: marshall(request.DeleteRequest.Key),
                            };
                        }
                        return newRequest;
                    });
                });
            }
        } else if (operationType === 'batchquery') {
            // Marshal the request items for BatchGetItem operation
            if (dbParams.RequestItems) {
                Object.keys(dbParams.RequestItems).forEach((tableName) => {
                    dbParams.RequestItems[tableName].Keys = dbParams.RequestItems[tableName].Keys.map((key) =>
                        marshall(key)
                    );
                });
            }
        } else if (operationType === 'transactionwrite') {
            // Marshal the TransactItems for TransactWriteItems operation
            if (dbParams.TransactItems) {
                dbParams.TransactItems = dbParams.TransactItems.map((transaction) => {
                    if (transaction.Put) {
                        transaction.Put.Item = marshall(transaction.Put.Item);
                    }
                    if (transaction.Update) {
                        if (transaction.Update.Key) {
                            transaction.Update.Key = marshall(transaction.Update.Key);
                        }
                        if (transaction.Update.ExpressionAttributeValues) {
                            transaction.Update.ExpressionAttributeValues = marshall(
                                transaction.Update.ExpressionAttributeValues
                            );
                        }
                    }
                    if (transaction.Delete) {
                        transaction.Delete.Key = marshall(transaction.Delete.Key);
                    }
                    return transaction;
                });
            }
        } else if (dbParams.ExpressionAttributeValues) {
            dbParams.ExpressionAttributeValues = marshall(dbParams.ExpressionAttributeValues);
        }

        console.log(dbParams);

        // Match operation types to commands
        switch (operationType) {
            case 'put':
                command = new PutItemCommand(dbParams); // PutItem command
                break;
            case 'query':
                command = new QueryCommand(dbParams); // Query command
                break;
            case 'update':
                command = new UpdateItemCommand(dbParams); // UpdateItem command
                break;
            case 'delete':
                command = new DeleteItemCommand(dbParams); // DeleteItem command
                break;
            case 'batchwrite':
                command = new BatchWriteItemCommand(dbParams); // BatchWriteItem command
                break;
            case 'batchquery':
                command = new BatchGetItemCommand(dbParams); // BatchGetItem command
                break;
            case 'transactionwrite':
                command = new TransactWriteItemsCommand(dbParams); // TransactWriteItems command
                break;
            default:
                throw new Error(
                    'Invalid operation type! Please use "put", "query", "update", "delete", "batchwrite", "batchquery", or "transactionwrite".'
                );
        }

        const result = await dbClient.send(command);

        // Handle unmarshalling for specific operations
        if (operationType === 'query' && result.Items) {
            result.Items = result.Items.map((item) => unmarshall(item));
        } else if (operationType === 'update' && result.Attributes) {
            result.Attributes = unmarshall(result.Attributes);
        } else if (operationType === 'batchquery' && result.Responses) {
            Object.keys(result.Responses).forEach((tableName) => {
                result.Responses[tableName] = result.Responses[tableName].map((item) => unmarshall(item));
            });
        }

        console.log(`Operation ${operationType} succeeded:`, result);
        return result;
    } catch (error) {
        console.error(`Error during ${operationType} operation:`, error);
        throw error;
    }
}

module.exports = { performDDBOperation };
