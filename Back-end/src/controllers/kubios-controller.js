/**
 * @apiDefine KubiosGroup Kubios Data
 * Proxy endpoints that forward authenticated requests to the Kubios Cloud API
 * on behalf of the logged-in user. A valid local JWT containing the Kubios
 * id_token is required for all endpoints in this group.
 */

/**
 * @apiDefine KubiosProxyError
 * @apiError (401) Unauthorized Missing, invalid, or expired JWT token.
 * @apiError (502) KubiosProxyError The upstream Kubios API returned an error or unreachable.
 * @apiErrorExample {json} 401-Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid or missing token"
 *     }
 * @apiErrorExample {json} 502-Bad-Gateway:
 *     HTTP/1.1 502 Bad Gateway
 *     {
 *       "message": "Upstream Kubios API request failed"
 *     }
 */

/**
 * @api {get} kubios/user-data Get Kubios users measurement data
 * @apiVersion 1.2.0
 * @apiName GetUserData
 * @apiGroup Kubios group
 *
 * @apiDescription Retrieves HRV measurement results for the authenticated user
 * from the Kubios Cloud API. The results are fetched from a fixed start date
 * of 2024-01-01T00:00:00+00:00 and return all recorded measurements up to
 * the current time. The response is proxied directly from Kubios without
 * transformation.
 *
 * The Kubios id_token is extracted from the authenticated user's JWT and used
 * as the Authorization header when calling the Kubios API endpoint:
 * GET {KUBIOS_API_URI}/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiSuccess {String}   status            Kubios API status, typically "ok".
 * @apiSuccess {Array}    results           List of HRV measurement result objects.
 * @apiSuccess {String}   results.daily_result  Daily measurement identifier.
 * @apiSuccess {String}   results.iso_date  Measurement date in ISO-format.
 * @apiSuccess {Object}   results.result    Measurement data (HRV-values, bpm, etc.).
 *
 * @apiSuccessExample {json} 200-Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "results": [
 *         {
 *           "daily_result": "uuid-string",
 *           "iso_date": "2024-03-15",
 *           "result": {
 *             "mean_hr_bpm": 62,
 *             "sdnn_ms": 55.3,
 *             "rmssd_ms": 48.1,
 *             "sns_index": 0.2,
 *             "pns_index": 1.5...
 *           }
 *         }
 *       ]
 *     }
 *
 * @apiUse KubiosProxyError
 */

/**
 * @api {get} kubios/user-info
 * @apiVersion 1.2.0
 * @apiName GetUserInfo
 * @apiGroup Kubios group
 *
 * @apiDescription Retrieves the Kubios user profile for the authenticated user
 * by proxying a request to the Kubios Cloud API. The response is returned
 * directly from Kubios without transformation.
 *
 * The Kubios id_token is extracted from the authenticated user's JWT and used
 * as the Authorization header when calling the Kubios API endpoint:
 * GET {KUBIOS_API_URI}/user/self
 *
 * Note: This endpoint returns similar user profile data to the local
 * GET /auth/me endpoint, but the data comes directly from Kubios rather
 * than the local database.
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiSuccess {String}   status           Kubios API status, typically "ok".
 * @apiSuccess {Object}   user             Kubios user profile object.
 * @apiSuccess {String}   user.email       Users Kubios-email.
 * @apiSuccess {String}   [user.name]      Users name in their Kubios profile.
 * @apiSuccess {String}   [user.birthday]  Users Birthday (YYYY-MM-DD).
 * @apiSuccess {String}   [user.gender]    Users Gender (if given).
 *
 * @apiSuccessExample {json} 200-Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "ok",
 *       "user": {
 *         "email": "kayttaja@example.com",
 *         "name": "Matti Meikäläinen",
 *         "birthday": "1990-05-20",
 *         "gender": "male"
 *       }
 *     }
 *
 * @apiUse KubiosProxyError
 */

import fetch from 'node-fetch';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;

 /**
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserData = async (req, res, next) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(

     baseUrl + '/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00',
     {
       method: 'GET',
       headers: headers,
     },
   );
   const results = await response.json();


   return res.json(results);
 };

 /**
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserInfo = async (req, res, next) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(baseUrl + '/user/self', {
     method: 'GET',
     headers: headers,
   });
   const userInfo = await response.json();
   return res.json(userInfo);
 };

 export {getUserData, getUserInfo};
