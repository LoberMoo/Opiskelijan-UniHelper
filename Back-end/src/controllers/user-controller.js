import bcrypt from 'bcryptjs';
import { getUsers, getUserbyId, addUser } from "../models/user-model.js";

/**
 * @apiDefine UserGroup Users
 * Endpoints that manage user accounts, registration, and lookup.
 * These routes are mounted under <code>{api_url}/api/users</code>.
 */

/**
 * @apiDefine AuthorizationHeader
 * @apiHeader {String} Authorization Bearer JWT token issued after a successful login.
 * @apiHeaderExample {json} Authorization Header Example:
 *   {
 *     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 */

/**
 * @apiDefine InternalServerError
 * @apiError (Error 5xx) {Object} InternalServerError An unexpected error occurred on the server.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Database connection failed"
 *   }
 */


/**
 * @api {get} {api_url}/api/users Hae kaikki käyttäjät (testikäyttö)
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup UserGroup
 *
 * @apiDescription
 * Returns a list of all usernames stored in the database.
 * **This endpoint is intended for testing only and is not part of the
 * production API surface.** It is not protected by authentication and
 * should be disabled or removed before release.
 *
 * The underlying database query is defined in <code>user-model.js → getUsers()</code>.
 *
 * @apiSuccess {Object[]} users Array of user objects.
 * @apiSuccess {String}   users.username  The username of the account.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   [
 *     { "username": "MattiM" },
 *     { "username": "SeppoO" }
 *   ]
 *
 * @apiUse InternalServerError
 *
 * @apiExample {curl} cURL Example:
 *   curl -X GET {api_url}/api/users
 */

// Only used for testing VV
// Fetch all users
const haeuserit = async (req, res) => {
  const result = await getUsers();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

/**
 * @api {get} {api_url}/api/users/:id Hae käyttäjä ID:llä (testikäyttö)
 * @apiVersion 1.0.0
 * @apiName GetUserById
 * @apiGroup UserGroup
 *
 * @apiDescription
 * Returns the username of a single user identified by their numeric
 * <code>user_id</code>.
 * **This endpoint is intended for testing only** and is not part of the
 * final production iteration. It is not protected by authentication.
 *
 * The underlying database query is defined in
 * <code>user-model.js -> getUserbyId(id)</code>.
 *
 * @apiParam {Number} id The unique numeric identifier of the user.
 *
 * @apiSuccess {String} username The username associated with the given ID.
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   { "username": "MattiM" }
 *
 * @apiError (Error 4xx) {String} NotFound No user was found for the given ID.
 * @apiErrorExample {json} 404 Not Found:
 *   HTTP/1.1 404 Not Found
 *
 * @apiUse InternalServerError
 *
 * @apiExample {curl} cURL Example:
 *   curl -X GET {api_url}/api/users/42
 */

// Only used for testing VV
// Fetch user by ID
const haeuserbyId = async (req, res) => {
  const result = await getUserbyId(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404);
  };
};

/**
 * @api {post} {api_url}/api/users Luo uusi käyttäjä
 * @apiVersion 1.0.0
 * @apiName PostUser
 * @apiGroup UserGroup
 *
 * @apiDescription
 * Creates a new user account in the database. The plaintext password
 * provided in the request body is hashed with <strong>bcrypt</strong>
 * (salt rounds: 10) before being stored. This function is called
 * internally by Kubios authentication functions to synchronise new users
 * from Kubios HRV into the local database — it is not typically called
 * directly by API consumers.
 *
 * Input validation (length, format) is enforced by the router middleware
 * before this controller is reached (see <code>user-router.js</code>).
 *
 * The database insert is handled by
 * <code>user-model.js -> addUser(user)</code>.
 *
 * @apiHeader  {String} Content-Type  Must be <code>application/json</code>.
 * @apiHeaderExample {json} Content-Type Header:
 *   { "Content-Type": "application/json" }
 *
 * @apiBody {String{3..20}} username  Alphanumeric username. Min 3, max 20 characters.
 * @apiBody {String{8..100}} password  Plaintext password. Min 8, max 100 characters.
 *                                     Will be hashed before storage.
 * @apiBody {String}         email     Valid e-mail address.
 *
 * @apiParamExample {json} Request Body Example:
 *   {
 *     "username": "MattiM",
 *     "password": "salasana123",
 *     "email":    "matti@esimerkki.fi"
 *   }
 *
 * @apiSuccess (201) {String} message  Confirmation message.
 * @apiSuccess (201) {Object} user_id  Object containing the auto-generated
 *                                     <code>user_id</code> of the new record.
 *
 * @apiSuccessExample {json} 201 Created:
 *   HTTP/1.1 201 Created
 *   {
 *     "message": "new user added",
 *     "user_id": { "user_id": 7 }
 *   }
 *
 * @apiError (Error 4xx) {Object} ValidationError  One or more request body
 *           fields failed validation (handled by router middleware).
 * @apiErrorExample {json} 400 Bad Request (validation):
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "message": "Validation failed",
 *     "errors": [
 *       { "field": "username", "message": "must be alphanumeric and 3–20 characters" }
 *     ]
 *   }
 *
 * @apiUse InternalServerError
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

// Used by Kubios functions to syncronize new users into the database
// post user into database
const postUser = async (pyynto, vastaus) => {
  const newUser = pyynto.body;
  // Calculations for password hashing
  const hash = await bcrypt.hash(newUser.password, 10);
  // Replacing the plaintext password with a hashed one before saving into the database
  newUser.password = hash;
  const newUserId = await addUser(newUser);
  vastaus.status(201).json({message: 'new user added', user_id: newUserId});
};


export {haeuserit, postUser, haeuserbyId};
