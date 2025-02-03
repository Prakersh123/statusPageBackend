/*
 *Filename: /home/codestax/statusPage/statusPage/src/middlewares/mentorAuthMW.js *
 *Path: /home/codestax/statusPage/statusPage                                   *
 *Created Date: Sunday, February 2nd 2025, 6:52:39 pm                          *
 *Author: Prakersharya                                                         *
 *                                                                             *
 *Copyright (c) 2025 Trinom Digital Pvt Ltd                                    *
 */


const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const { errorHandler } = require("./errorHandlingMW");
const organizationHelper = require('../helper/organizationHelper');
function mentorAuthMiddleware() {
    return async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return errorHandler(401, res, req, "Authorization header missing", "Unauthorized");
        }

        const [authType, authValue] = authorizationHeader.split(" ");
        if (!authValue) {
            return errorHandler(401, res, req, "Auth token missing", "Unauthorized");
        }

        let tokenDetails;
        try {
            tokenDetails = await organizationHelper.getLoginSessionToken(authValue);
            if (tokenDetails.Items.length == 0) {
                return errorHandler(401, res, req, "Invalid auth token", "Unauthorized");
            }
        } catch (error) {
            return errorHandler(500, res, req, "Error fetching token details", "Server Error");
        }
        tokenDetails = tokenDetails.Items[0];
        let decodedUserData;
        console.log('tokenDetails', JSON.stringify(tokenDetails));
        try {
            console.log('secrr', JSON.stringify(process.env.JWT_SECRET));
            decodedUserData = jwt.verify(tokenDetails.pk, process.env.JWT_SECRET);
        } catch (error) {
            return errorHandler(401, res, req, "Invalid or expired token", "Invalid Token");
        }

        try {
            let UserData;
            console.log('decoded', decodedUserData);
            UserData = await organizationHelper.getUserByEmailIDPassword(decodedUserData.emailID, '');
            if (UserData.Items.length == 0) {
                return errorHandler(400, res, req, 'User not exist in system', 'USER NOT EXIST WITH THIS EMAIL');
            }
            req.userDetails = UserData.Items[0];
        } catch (error) {
            return errorHandler(500, res, req, "Error fetching mentor details", "Server Error");
        }

        next();
    };
}

module.exports = mentorAuthMiddleware;
