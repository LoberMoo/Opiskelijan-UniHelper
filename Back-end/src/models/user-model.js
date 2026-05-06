import promisePool from '../utils/database.js';

/**
 * @apiDefine ModelGroup User Model (Database Layer)
 * Internal database access functions for the <code>users</code> table.
 * These functions are not directly exposed as HTTP endpoints — they are
 * called by the controller layer (<code>user-controller.js</code>) and
 * Kubios integration functions.
 *
 * All functions use the shared MySQL promise pool defined in
 * <code>utils/database.js</code>.
 */


/**
 * @api {get} {api_url}/api/users [Model] Hae kaikki käyttäjät
 * @apiVersion 1.0.0
 * @apiName ModelGetUsers
 * @apiGroup ModelGroup
 * @apiPrivate
 *
 * @apiDescription
 * Internal model function: executes
 * <code>SELECT username FROM users;</code> and returns all rows.
 * Used exclusively during development and testing; not called in the
 * final production iteration.
 *
 * @apiSuccess {Object[]} rows          Array of user row objects.
 * @apiSuccess {String}   rows.username The stored username.
 *
 * @apiSuccessExample {json} Successful Result:
 *   [
 *     { "username": "MattiM" },
 *     { "username": "SeppoO"  }
 *   ]
 *
 * @apiError (Internal) {Object} error  Object containing the database
 *           error message if the query fails.
 * @apiErrorExample {json} Database Error:
 *   { "error": "ER_ACCESS_DENIED_ERROR: Access denied for user..." }
 */


// GET /api/users - list all users
// Unused other than for test requests, not in the final iteration
const getUsers = async () => {
  try {
  const [rows] = await promisePool.query('SELECT username from users;');
  return rows;

  } catch (error) {
    console.error('error', error.message);
    return {error: error.message};
  }
};

/**
 * @api {get} {api_url}/api/users/:id [Model] Hae käyttäjä ID:llä
 * @apiVersion 1.0.0
 * @apiName ModelGetUserById
 * @apiGroup ModelGroup
 * @apiPrivate
 *
 * @apiDescription
 * Internal model function: executes a parameterised prepared statement
 * <code>SELECT username FROM users WHERE user_id = ?</code>.
 * Returns the first matching row or <code>undefined</code> if no user
 * exists for the given ID.
 * Used by Kubios authentication functions.
 *
 * @apiParam {Number} id The numeric primary key (<code>user_id</code>) to look up.
 *
 * @apiSuccess {String} username The username of the matched user.
 *
 * @apiSuccessExample {json} Successful Result:
 *   { "username": "matti123" }
 *
 * @apiError (Internal) {undefined} NotFound Returns <code>undefined</code>
 *           when no row matches the given ID.
 * @apiError (Internal) {Object}    error     Returns an error object if the
 *           query throws an exception.
 * @apiErrorExample {json} Database Error:
 *   { "error": "ER_BAD_FIELD_ERROR: Unknown column..." }
 */
// Used by Kubios functions
// get /api/users/:ID - get user by id
const getUserbyId = async (id) => {
  try {
  const [rows] = await promisePool.execute('SELECT username from users where user_id = ?', [id]);
  return rows[0];

  } catch (error) {
    console.error('error', error.message);
    return {error: error.message};
  }
};

/**
 * @api {post} {api_url}/api/users [Model] Lisää uusi käyttäjä
 * @apiVersion 1.0.0
 * @apiName ModelAddUser
 * @apiGroup ModelGroup
 * @apiPrivate
 *
 * @apiDescription
 * Internal model function: inserts a new user row into the
 * <code>users</code> table using a parameterised prepared statement.
 * The <code>password</code> field must already be hashed by the caller
 * (see <code>user-controller.js → postUser</code>) before this function
 * is invoked — this function does **not** perform any hashing.
 *
 * Used by Kubios functions to synchronise new users into the local database.
 *
 * @apiBody {String} username  Alphanumeric username (pre-validated by router).
 * @apiBody {String} password  Bcrypt-hashed password string.
 * @apiBody {String} email     Valid e-mail address (pre-validated by router).
 *
 * @apiSuccess {Object} result           Result object.
 * @apiSuccess {Number} result.user_id   The auto-incremented primary key
 *                                       assigned to the new row.
 *
 * @apiSuccessExample {json} Successful Insert:
 *   { "user_id": 7 }
 *
 * @apiError (Internal) {Object} error  Error object returned if the insert
 *           fails (e.g. duplicate username or e-mail, constraint violation).
 * @apiErrorExample {json} Duplicate Entry Error:
 *   { "error": "ER_DUP_ENTRY: Duplicate entry 'matti123' for key 'username'" }
 */

// Used by Kubios functions to syncronize new users into the database
// POST /api/users - add a new user
const addUser = async (user) => {
  const {username, password, email} = user;
  const sqlhaku = `INSERT INTO users (username, password, email)
  VALUES (?, ?, ?)`;
  const params = [username, password, email];
  try {
    const result = await promisePool.execute(sqlhaku, params);
    return {user_id: result[0].insertId};
  } catch (e) {
    console.error('virhe', e.message);
    return {error: e.message}
  };
}

/**
 * @api {get} {api_url}/api/users?username=:username [Model] Hae käyttäjä käyttäjänimellä
 * @apiVersion 1.0.0
 * @apiName ModelFindUserByUsername
 * @apiGroup ModelGroup
 * @apiPrivate
 *
 * @apiDescription
 * Internal model function: looks up a full user row by username using
 * <code>SELECT * FROM Users WHERE username = ?</code>.
 * Returns the first matching row or <code>undefined</code> if no match
 * is found.
 *
 * **Note:** This function is marked as unused in the final production
 * iteration and is retained only for test purposes. The returned object
 * contains the hashed <code>password</code> field — callers must handle
 * this appropriately and must not expose it over the API.
 *
 * @apiParam {String} username  The username string to search for.
 *
 * @apiSuccess {Number} user_id    Numeric primary key.
 * @apiSuccess {String} username   Stored username.
 * @apiSuccess {String} password   Bcrypt-hashed password — **do not expose**.
 * @apiSuccess {String} email      Registered e-mail address.
 *
 * @apiSuccessExample {json} Successful Result:
 *   {
 *     "user_id":  3,
 *     "username": "MattiM",
 *     "password": "$2a$10$...",
 *     "email":    "matti@esimerkki.fi"
 *   }
 *
 * @apiError (Internal) {undefined} NotFound Returns <code>undefined</code>
 *           when no user matches the given username.
 */

// Unused other than for test requests, not in the final iteration
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
};

/**
 * @api {get} {api_url}/api/users?email=:email [Model] Hae käyttäjä sähköpostilla
 * @apiVersion 1.0.0
 * @apiName ModelSelectUserByEmail
 * @apiGroup ModelGroup
 * @apiPrivate
 *
 * @apiDescription
 * Internal model function used by Kubios integration: retrieves a full
 * user record by e-mail address using
 * <code>SELECT * FROM Users WHERE email = ?</code>.
 *
 * The <code>password</code> field is **deleted** from the returned object
 * before it is passed back to the caller — it is never exposed downstream.
 *
 * Returns a structured error object (not a thrown exception) when no user
 * is found or when a database error occurs, allowing callers to branch on
 * the <code>error</code> property.
 *
 * @apiParam {String} email  The e-mail address to search for.
 *
 * @apiSuccess {Number} user_id   Numeric primary key.
 * @apiSuccess {String} username  Stored username.
 * @apiSuccess {String} email     Registered e-mail address.
 *
 * @apiSuccessExample {json} Successful Result:
 *   {
 *     "user_id":  3,
 *     "username": "MattiM",
 *     "email":    "matti@esimerkki.fi"
 *   }
 *
 * @apiError (Error 4xx) {Number} error    HTTP-style status code (<code>404</code>).
 * @apiError (Error 4xx) {String} message  Human-readable explanation.
 * @apiErrorExample {json} 404 User Not Found:
 *   { "error": 404, "message": "user not found" }
 *
 * @apiError (Error 5xx) {Number} error    HTTP-style status code (<code>500</code>).
 * @apiError (Error 5xx) {String} message  Human-readable explanation.
 * @apiErrorExample {json} 500 Database Error:
 *   { "error": 500, "message": "db error" }
 */

// Used for kubios functions
const selectUserByEmail = async (email) => {
   try {
     const sql = 'SELECT * FROM Users WHERE email = ?';
     const params = [email];
     const [rows] = await promisePool.query(sql, params);
     // console.log(rows);
     // if nothing is found with the user id, result array is empty []
     if (rows.length === 0) {
       return {error: 404, message: 'user not found'};
     }
     // Remove password property from result
     delete rows[0].password;
     return rows[0];
   } catch (error) {
     console.error('selectUserByEmail', error);
     return {error: 500, message: 'db error'};
   }
 };

export {findUserByUsername, getUsers, getUserbyId, addUser, selectUserByEmail};
