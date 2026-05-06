/**
 * @apiDefine UserRouterGroup Users API
 *
 * @apiDescription
 * ## Users API
 *
 * Manages user accounts, authentication, and profile retrieval.
 * All routes are mounted at <code>/api/users</code>.
 *
 * ### Base URL
 * <code>{api_url}/api/users</code>
 *
 * ### Authentication
 * Most endpoints are public during the current test iteration.
 * The <code>GET /me</code> endpoint requires a valid **JWT Bearer token**
 * obtained from <code>POST /login</code>.
 * Include the token in the <code>Authorization</code> header:
 * <pre>Authorization: Bearer &lt;token&gt;</pre>
 *
 * ### Rate Limits
 * No rate limiting is currently configured on these endpoints.
 * Consult the infrastructure team before exposing them publicly.
 *
 * ### Error Codes
 * | Code | Meaning |
 * |------|---------|
 * | 400  | Validation error – one or more request fields are invalid |
 * | 401  | Unauthorised – missing or invalid JWT token |
 * | 404  | Resource not found |
 * | 500  | Internal server error – database or runtime failure |
 */


/**
 * @api {get} {api_url}/api/users Hae kaikki käyttäjät
 * @apiVersion 1.0.0
 * @apiName GetAllUsers
 * @apiGroup Users API
 *
 * @apiDescription
 * Returns a list of all usernames currently registered in the database.
 *
 * > **Testikäyttö vain** — This endpoint is used only during
 * > development and testing. It has no authentication guard and is not
 * > intended for the final production release.
 *
 * Delegates to <code>user-controller.js -> haeuserit()</code> which
 * calls <code>user-model.js -> getUsers()</code>.
 *
 * @apiSuccess {Object[]} users            List of user objects.
 * @apiSuccess {String}   users.username   The username of the account.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   [
 *     { "username": "matti123" },
 *     { "username": "liisa_t"  }
 *   ]
 *
 * @apiError (Error 5xx) {Object} InternalServerError Database query failed.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   { "error": "ER_ACCESS_DENIED_ERROR: Access denied for user..." }
 *
 * @apiExample {curl} cURL Example:
 *   curl -X GET {api_url}/api/users
 */



  /**
 * @api {post} {api_url}/api/users Luo uusi käyttäjä
 * @apiVersion 1.0.0
 * @apiName PostUser
 * @apiGroup Users API
 *
 * @apiDescription
 * Creates a new user account. The request body is validated by
 * <code>express-validator</code> middleware before the controller is
 * invoked:
 * - <code>username</code>: alphanumeric, 3–20 characters.
 * - <code>password</code>: 8–100 characters.
 * - <code>email</code>: must be a valid e-mail address.
 *
 * Validation errors are handled by <code>validationErrorHandler</code>
 * middleware and return a <code>400</code> response before the database
 * is touched.
 *
 * The password is hashed with bcrypt (salt rounds: 10) inside
 * <code>user-controller.js → postUser()</code> before storage.
 *
 * This route is used by Kubios HRV integration to synchronise new
 * accounts into the local database.
 *
 * @apiHeader  {String} Content-Type  <code>application/json</code>
 *
 * @apiBody {String{3..20}} username  Alphanumeric username.
 * @apiBody {String{8..100}} password Plaintext password (hashed before storage).
 * @apiBody {String}         email    Valid e-mail address.
 *
 * @apiParamExample {json} Request Body Example:
 *   {
 *     "username": "matti123",
 *     "password": "salasana99",
 *     "email":    "matti@esimerkki.fi"
 *   }
 *
 * @apiSuccess (201) {String} message  Confirmation text.
 * @apiSuccess (201) {Object} user_id  Object with the new user's auto-generated ID.
 * @apiSuccess (201) {Number} user_id.user_id The numeric primary key.
 *
 * @apiSuccessExample {json} 201 Created:
 *   HTTP/1.1 201 Created
 *   {
 *     "message": "new user added",
 *     "user_id": { "user_id": 7 }
 *   }
 *
 * @apiError (Error 4xx) {Object[]} errors  Array of validation errors.
 * @apiErrorExample {json} 400 Bad Request (validation):
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "message": "Validation failed",
 *     "errors": [
 *       {
 *         "field":   "username",
 *         "message": "must be alphanumeric and 3–20 characters"
 *       }
 *     ]
 *   }
 *
 * @apiError (Error 5xx) {Object} InternalServerError Database insert failed.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   { "error": "ER_DUP_ENTRY: Duplicate entry 'matti123' for key 'username'" }
 *
 * @apiExample {curl} cURL Example:
 *   curl -X POST {api_url}/api/users \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *           "username": "MattiM",
 *           "password": "salasana123",
 *           "email":    "matti@esimerkki.fi"
 *         }'

 */


/**
 * @api {get} {api_url}/api/users/:id Hae käyttäjä ID:llä
 * @apiVersion 1.0.0
 * @apiName GetUserById
 * @apiGroup Users API
 *
 * @apiDescription
 * Returns the username for the user matching the given numeric
 * <code>user_id</code>.
 *
 * > **Testikäyttö vain** — This endpoint is used only during
 * > development and testing. It has no authentication guard.
 *
 * Delegates to <code>user-controller.js → haeuserbyId()</code> which
 * calls <code>user-model.js → getUserbyId(id)</code>.
 *
 * @apiParam {Number} id  The unique numeric user identifier (<code>user_id</code>).
 *
 * @apiSuccess {String} username  The username of the matched account.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   { "username": "MattiM" }
 *
 * @apiError (Error 4xx) NotFound No user found for the provided ID.
 * @apiErrorExample {text} 404 Not Found:
 *   HTTP/1.1 404 Not Found
 *
 * @apiError (Error 5xx) {Object} InternalServerError Database query failed.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   { "error": "ER_BAD_FIELD_ERROR: Unknown column..." }
 *
 * @apiExample {curl} cURL Example:
 *   curl -X GET {api_url}/api/users/42
 */



/**
 * @api {post} {api_url}/api/users/login Kirjaudu sisään (Kubios)
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Users API
 *
 * @apiDescription
 * Authenticates a user against the Kubios HRV service and issues a
 * local JWT access token upon success. Handled by
 * <code>kubios-auth-controller.js → postLogin()</code>.
 *
 * Credentials are forwarded to the Kubios API; if Kubios returns a
 * successful response the user record is synchronised into the local
 * database (via <code>postUser</code>) if it does not already exist,
 * and a signed JWT is returned to the client.
 *
 * @apiHeader  {String} Content-Type  <code>application/json</code>
 *
 * @apiBody {String} username  Registered Kubios username.
 * @apiBody {String} password  Registered Kubios password (plaintext over HTTPS).
 *
 * @apiParamExample {json} Request Body Example:
 *   {
 *     "username": "MattiM",
 *     "password": "salasana123"
 *   }
 *
 * @apiSuccess {String} token  Signed JWT Bearer token.
 * @apiSuccess {Object} user   Basic user information returned from Kubios.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     "user": {
 *       "username": "MattiM",
 *       "email":    "matti@esimerkki.fi"
 *     }
 *   }
 *
 * @apiError (Error 4xx) {Object} Unauthorized Invalid credentials.
 * @apiErrorExample {json} 401 Unauthorized:
 *   HTTP/1.1 401 Unauthorized
 *   { "message": "Invalid credentials" }
 *
 * @apiError (Error 5xx) {Object} InternalServerError Kubios service or
 *           database error.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   { "message": "Login failed due to a server error" }
 *
 * @apiExample {curl} cURL Example:
 *   curl -X POST {api_url}/api/users/login \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *           "username": "MattiM",
 *           "password": "Salasana123"
 *         }'
 */


/**
 * @api {get} {api_url}/api/users/me Hae kirjautuneen käyttäjän tiedot
 * @apiVersion 1.0.0
 * @apiName GetMe
 * @apiGroup Users API
 *
 * @apiDescription
 * Returns profile information for the currently authenticated user.
 * The request must include a valid JWT Bearer token issued by
 * <code>POST /login</code>.
 *
 * Authentication is enforced by the <code>authenticateToken</code>
 * middleware (<code>middlewares/authentication.js</code>).
 * If the token is missing or invalid the middleware rejects the request
 * with <code>401</code> before the controller is reached.
 *
 * User data is retrieved from the Kubios API using the token embedded
 * in the request. Handled by
 * <code>kubios-auth-controller.js -> getMe()</code>.
 *
 * @apiHeader  {String} Authorization  <code>Bearer &lt;token&gt;</code>
 * @apiHeaderExample {json} Authorization Header:
 *   { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *
 * @apiSuccess {Number} user_id   Local numeric user ID.
 * @apiSuccess {String} username  Username of the authenticated user.
 * @apiSuccess {String} email     E-mail address of the authenticated user.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   {
 *     "user_id":  3,
 *     "username": "MattiM",
 *     "email":    "matti@esimerkki.fi"
 *   }
 *
 * @apiError (Error 4xx) {Object} Unauthorized Token missing, malformed, or expired.
 * @apiErrorExample {json} 401 Unauthorized:
 *   HTTP/1.1 401 Unauthorized
 *   { "message": "Invalid or expired token" }
 *
 * @apiError (Error 5xx) {Object} InternalServerError Kubios upstream error or
 *           database failure.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   { "message": "Failed to retrieve user information" }
 *
 * @apiExample {curl} cURL Example:
 *   curl -X GET {api_url}/api/users/me \
 *     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

 */

import express from 'express';
import {body} from 'express-validator';
import {haeuserbyId,haeuserit, postUser} from '../controllers/user-controller.js';
import {getMe, postLogin} from '../controllers/kubios-auth-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';

const userRouter = express.Router();

userRouter.route('/')
  .get(haeuserit).post(body('username').isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').isLength({ min: 8, max: 100 }),
    body('email').isEmail(),
    validationErrorHandler,
    postUser
  );

userRouter.route('/:id').get(haeuserbyId);

userRouter.post('/login', postLogin);

userRouter.get('/me', authenticateToken, getMe);

export default userRouter;
