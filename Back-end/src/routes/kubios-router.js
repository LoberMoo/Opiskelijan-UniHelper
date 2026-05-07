 /**
 * @apiDefine kubiosRouter Kubios Router
 * Express router for Kubios Cloud API proxy endpoints.
 * All routes require a valid JWT obtained from POST /auth/login.
 * The JWT must be passed as a Bearer token in the Authorization header.
 */

/**
 * @api {get} kubios/user-data Get Kubios measurements
 * @apiVersion 1.2.0
 * @apiName KubiosGetUserData
 * @apiGroup Kubios group
 *
 * @apiDescription Route handler for retrieving the user's Kubios HRV
 * measurement results. Requires a valid JWT. The request is passed through
 * the `authenticateToken` middleware before reaching the controller.
 * See the KubiosGroup GetUserData endpoint for full parameter and
 * response documentation.
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiUse KubiosProxyError
 */

/**
 * @api {get} kubios/user-info Get User profile
 * @apiVersion 1.2.0
 * @apiName KubiosGetUserInfo
 * @apiGroup Kubios group
 *
 * @apiDescription Route handler for retrieving the authenticated user's
 * Kubios profile. Requires a valid JWT. The request is passed through the
 * `authenticateToken` middleware before reaching the controller.
 * See the KubiosGroup GetUserInfo endpoint for full parameter and
 * response documentation.
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiUse KubiosProxyError
 */

 import express from 'express';
 import {authenticateToken} from '../middlewares/authentication.js';
 import {getUserData, getUserInfo} from '../controllers/kubios-controller.js';

 const kubiosRouter = express.Router();

 kubiosRouter
   .get('/user-data', authenticateToken, getUserData)
   .get('/user-info', authenticateToken, getUserInfo);

 export default kubiosRouter;
