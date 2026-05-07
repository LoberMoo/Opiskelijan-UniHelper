 /**
 * @apiDefine KubiosGroup Authentication
 * Authentication endpoints using Kubios API as the identity provider.
 * Users authenticate via Kubios credentials and receive a local JWT token
 * for subsequent requests.
 */

 /**
 * @apiDefine KubiosAuthError
 * @apiError (401) KubiosAuthFailed Bad username or password provided to Kubios.
 * @apiError (500) KubiosLoginError Kubios API request failed unexpectedly.
 * @apiError (500) KubiosUserInfoError Failed to retrieve user info from Kubios API.
 * @apiErrorExample {json} 401-Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Login with Kubios failed due bad username/password"
 *     }
 * @apiErrorExample {json} 500-Internal-Server-Error:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Login with Kubios failed"
 *     }
 */

  /**
 * @api {post} kubios/login
 * @apiVersion 1.2.0
 * @apiName PostLogin
 * @apiGroup Kubios group
 *
 * @apiDescription Authenticates a user via the Kubios API using their Kubios
 * credentials. On success, the user is synced with the local database
 * (created if not yet present) and a signed local JWT token is returned.
 * This JWT must be included in the Authorization header as a Bearer token
 * for all protected endpoints.
 *
 * Authentication flow:
 * 1. Sends credentials to Kubios login URL using CSRF + User-Agent headers.
 * 2. Parses the redirect location header for the Kubios id_token.
 * 3. Uses id_token to fetch the Kubios user profile (/user/self).
 * 4. Syncs the Kubios user with the local database by email.
 * 5. Signs and returns a local JWT embedding the local user ID and
 *    the Kubios id_token for downstream Kubios API calls.
 *
 * @apiHeader {String} Content-Type application/json
 *
 * @apiBody {String} username Kubios-tilin käyttäjätunnus (sähköpostiosoite).
 * @apiBody {String} password Kubios-tilin salasana.
 *
 * @apiParamExample {json} Request-Body-Example:
 *     {
 *       "username": "kayttaja@example.com",
 *       "password": "salasana123"
 *     }
 *
 * @apiSuccess {String}   message         Confirmation message.
 * @apiSuccess {Object}   user            Kubios user profile object.
 * @apiSuccess {String}   user.email      Käyttäjän sähköpostiosoite.
 * @apiSuccess {String}   [user.name]     Käyttäjän nimi (jos saatavilla Kubios-profiilista).
 * @apiSuccess {Number}   user_id         Local database user ID.
 * @apiSuccess {String}   token           Signed JWT token for authenticating future requests.
 *
 * @apiSuccessExample {json} 200-Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Logged in successfully with Kubios",
 *       "user": {
 *         "email": "kayttaja@example.com",
 *         "name": "Matti Meikäläinen"
 *       },
 *       "user_id": 42,
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     }
 *
 * @apiUse KubiosAuthError
 */

  /**
 * @api {get} users/me
 * @apiVersion 1.2.0
 * @apiName GetMe
 * @apiGroup Kubios group
 *
 * @apiDescription Returns the local database profile of the currently
 * authenticated user and their active Kubios id_token. The user is identified
 * from the JWT payload. The returned kubios_token can be inspected for
 * debugging but is not meant to be used directly by the client — it is
 * handled server-side when proxying Kubios API requests.
 *
 * @apiHeader {String} Authorization Bearer {token}
 *
 * @apiSuccess {Object}   user              Local database user object.
 * @apiSuccess {Number}   user.user_id      Käyttäjän paikallinen tietokanta-ID.
 * @apiSuccess {String}   user.email        Käyttäjän sähköpostiosoite.
 * @apiSuccess {String}   user.username     Käyttäjätunnus paikallisessa tietokannassa.
 * @apiSuccess {String}   kubios_token      Active Kubios id_token embedded in the current JWT.
 *
 * @apiSuccessExample {json} 200-Success:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "user_id": 42,
 *         "username": "kayttaja@example.com",
 *         "email": "kayttaja@example.com"
 *       },
 *       "kubios_token": "eyJraWQiOiJLdWJpb3MtaWR0b2tlbi..."
 *     }
 *
 * @apiError (401) Unauthorized Missing or invalid JWT token.
 * @apiErrorExample {json} 401-Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid or missing token"
 *     }
 *
 * @apiError (404) UserNotFound User ID from token not found in local database.
 * @apiErrorExample {json} 404-Not-Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 */

 /**
  * Authentication resource controller using Kubios API for login
 * @module controllers/auth-controller
 * @author
 * @requires jsonwebtoken
 * @requires bcryptjs
 * @requires dotenv
 * @requires models/user-model
 * @requires middlewares/error-handler
 * @exports postLogin
 * @exports getMe
 */

//  import 'dotenv/config';
 import jwt from 'jsonwebtoken';
 import fetch from 'node-fetch';
 import {v4} from 'uuid';

 import {
   addUser,
   selectUserByEmail,
   getUserbyId,
 } from '../models/user-model.js';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;


 /**
 * Creates a POST login request to Kubios API
 * @async
 * @param {string} username Username in Kubios
 * @param {string} password Password in Kubios
 * @return {string} idToken Kubios id token
 */
 const kubiosLogin = async (username, password) => {
   const csrf = v4();
   const headers = new Headers();
   headers.append('Cookie', `XSRF-TOKEN=${csrf}`);
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   const searchParams = new URLSearchParams();
   searchParams.set('username', username);
   searchParams.set('password', password);
   searchParams.set('client_id', process.env.KUBIOS_CLIENT_ID);
   searchParams.set('redirect_uri', process.env.KUBIOS_REDIRECT_URI);
   searchParams.set('response_type', 'token');
   searchParams.set('scope', 'openid');
   searchParams.set('_csrf', csrf);

   const options = {
     method: 'POST',
     headers: headers,
     redirect: 'manual',
     body: searchParams,
   };
   let response;
   try {
     response = await fetch(process.env.KUBIOS_LOGIN_URL, options);
   } catch (err) {
     console.error('Kubios login error', err);
     throw new Error('Login with Kubios failed', 500);
   }
   const location = response.headers.raw().location[0];
   // console.log(location);
   // If login fails, location contains 'login?null'
   if (location.includes('login?null')) {
     throw new Error(
       'Login with Kubios failed due bad username/password',
       401,
     );
   }
   // If login success, Kubios response location header
   // contains id_token, access_token and expires_in
   const regex = /id_token=(.*)&access_token=(.*)&expires_in=(.*)/;
   const match = location.match(regex);
   const idToken = match[1];
   return idToken;
 };

 /**
 * Get user info from Kubios API
 * @async
 * @param {string} idToken Kubios id token
 * @return {object} user User info
 */
 const kubiosUserInfo = async (idToken) => {
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', idToken);
   const response = await fetch(baseUrl + '/user/self', {
     method: 'GET',
     headers: headers,
   });
   const responseJson = await response.json();
   if (responseJson.status === 'ok') {
     return responseJson.user;
   } else {
     throw new Error('Kubios user info failed', 500);
   }
 };

 /**
 * Sync Kubios user info with local db
 * @async
 * @param {object} kubiosUser User info from Kubios API
 * @return {number} userId User id in local db
 */
 const syncWithLocalUser = async (kubiosUser) => {
   // Check if user exists in local db
   let userId;
   const result = await selectUserByEmail(kubiosUser.email);
   // If user with the email not found, create new user, otherwise use existing
   if (result.error) {
     // Create user
     const newUser = {
       username: kubiosUser.email,
       email: kubiosUser.email,
       // Random password, quick workaround for the required field
       password: v4(),
     };
     const newUserResult = await addUser(newUser);
     userId = newUserResult.user_id;
   } else {
     userId = result.user_id;
   }
   console.log('syncWithLocalUser userId', userId);
   return userId;
 };

 /**
 * User login
 * @async
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {object} user if username & password match
 */
 const postLogin = async (req, res, next) => {
   const {username, password} = req.body;
   // console.log('login', req.body);
   try {
     // Try to login with Kubios
     const kubiosIdToken = await kubiosLogin(username, password);
     const kubiosUser = await kubiosUserInfo(kubiosIdToken);
     const localUserId = await syncWithLocalUser(kubiosUser);
     // Include kubiosIdToken in the auth token used in this app
     // NOTE: What is the expiration time of the Kubios token?
     const token = jwt.sign(
      //  {userId: localUserId, kubiosIdToken},
      {user_id: localUserId, kubiosIdToken},
       process.env.JWT_SECRET,
       {
         expiresIn: process.env.JWT_EXPIRES_IN,
       },
     );
     return res.json({
       message: 'Logged in successfully with Kubios',
       user: kubiosUser,
       user_id: localUserId,
       token,
     });
   } catch (err) {
     console.error('Kubios login error', err);
     return next(err);
   }
 };

 /**
 * Get user info based on token
 * @async
 * @param {object} req
 * @param {object} res
 * @return {object} user info
 */
 const getMe = async (req, res) => {
  //  const user = await getUserbyId(req.user.userId);
  const user = await getUserbyId(req.user.user_id);
   res.json({user, kubios_token: req.user.kubiosIdToken});
 };

 export {postLogin, getMe};
