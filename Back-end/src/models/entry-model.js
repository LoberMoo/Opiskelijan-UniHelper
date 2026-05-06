import promisePool from '../utils/database.js';

/**
 * @apiDefine DiaryEntryObject
 * @apiSuccess {Number}  entry_id      Auto-incremented primary key of the entry.
 * @apiSuccess {Number}  user_id       Foreign key referencing the owning user.
 * @apiSuccess {String}  entry_date    Date of the entry (YYYY-MM-DD, from MySQL DATE column).
 * @apiSuccess {Number}  [mood]        Mood rating stored as a numeric value. Valid range unspecified.
 * @apiSuccess {Number}  [weight]      Body weight. Unit (kg/lbs) and precision unspecified.
 * @apiSuccess {Number}  [sleep_hours] Hours of sleep. Precision (integer vs decimal) unspecified.
 * @apiSuccess {String}  [notes]       Free-text field, max length unspecified.
 */

/**
 * @apiDefine DiaryEntryObject
 * @apiSuccess {Number}  entry_id      Auto-incremented primary key of the entry.
 * @apiSuccess {Number}  user_id       Foreign key referencing the owning user.
 * @apiSuccess {String}  entry_date    Date of the entry (YYYY-MM-DD, from MySQL DATE column).
 * @apiSuccess {Number}  [mood]        Mood rating stored as a numeric value. Valid range unspecified.
 * @apiSuccess {Number}  [weight]      Body weight. Unit (kg/lbs) and precision unspecified.
 * @apiSuccess {Number}  [sleep_hours] Hours of sleep. Precision (integer vs decimal) unspecified.
 * @apiSuccess {String}  [notes]       Free-text field, max length unspecified.
 */


/**
 * @api {db} diaryentries/listAll List All Entries for a User
 * @apiVersion 1.0.0
 * @apiName listAllEntries
 * @apiGroup EntryModel
 * @apiDescription Executes `SELECT * FROM diaryentries WHERE user_id = ?` using a
 *  parameterised prepared statement. Returns all diary entries belonging to `user_id`.
 *  Called internally by the `getEntries` controller.
 *
 * @apiParam  {Number} user_id  ID of the user whose entries to retrieve (from JWT payload).
 *
 * @apiUse DiaryEntryObject
 *
 * @apiSuccessExample {json} Resolved value (success):
 *   [
 *     {
 *       "entry_id": 12,
 *       "user_id": 3,
 *       "entry_date": "2024-05-01",
 *       "mood": "{String}",
 *       "weight": 76,
 *       "sleep_hours": 7,
 *       "notes": "Feeling good today."
 *     }
 *   ]
 *
 * @apiError {Object} error  Database error message string (`e.message`).
 * @apiErrorExample {json} Resolved value (error):
 *   { "error": "ER_NO_SUCH_TABLE: Table 'db.diaryentries' doesn't exist" }
 *
 * @apiDescription Returns `[]` (empty array) when no entries exist for the user, not an error object.
 * The queries should match specifically what table names are set in SQL,
 * unless you have set the `lower_case_table_names` setting in MySQL
 */

const listAllEntries = async (user_id) => {
  console.log(user_id)
  try {
    const sql = 'SELECT * FROM DiaryEntries WHERE user_id = ?;'
    const [rows] = await promisePool.execute(sql, [user_id]);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

/**
 * @api {db} diaryentries/findById Find Entry by Primary Key
 * @apiVersion 1.0.0
 * @apiName findEntryById
 * @apiGroup EntryModel
 * @apiDescription Executes `SELECT * FROM DiaryEntries WHERE entry_id = ?` using a
 *   parameterised prepared statement. Returns the first matching row, or `undefined`
 *   if no entry matches. No `user_id` filter is applied — ownership is not checked
 *   at the model layer.
 *
 * @apiParam {Number} id  The unique numeric `entry_id` to look up.
 *
 * @apiUse DiaryEntryObject
 *
 * @apiSuccessExample {json} Resolved value (found):
 *   {
 *     "entry_id": 12,
 *     "user_id": 3,
 *     "entry_date": "2024-05-01",
 *     "mood": "{String}",
 *     "weight": 76,
 *     "sleep_hours": 7,
 *     "notes": "Feeling good today."
 *   }
 *
 * @apiSuccessExample {undefined} Resolved value (not found):
 *   undefined
 *
 * @apiError {Object} error  Database error message string (`e.message`).
 * @apiErrorExample {json} Resolved value (error):
 *   { "error": "ER_BAD_FIELD_ERROR: Unknown column 'entry_id'..." }
 *
 * @apiDescription This endpoint isn't used in the current version of the webapp because all the entires are fetched at the same time, there is current no function in the client to search for specific entries.
 *  Returns `undefined` (not `null`) when no row is found.
 *  The controller checks truthiness: `if (entry)` — `undefined` is falsy,
 *  but so is `0` or `""`, so be careful with future return-value changes.
 */

const findEntryById = async (id) => {
  try {
    // prepared statement
    const [rows] = await promisePool.execute('SELECT * FROM DiaryEntries WHERE entry_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

/**
 * @api {db} DiaryEntries/insert Add New Entry
 * @apiVersion 1.0.0
 * @apiName addEntry
 * @apiGroup EntryModel
 * @apiDescription Inserts a new row into the `DiaryEntries` table using a
 *   parameterised INSERT statement. Returns the auto-generated `entry_id` on success.
 *
 * @apiParam {Object} entry              Entry data object.
 * @apiParam {Number} entry.user_id      ID of the entry owner.
 * @apiParam {String} entry.entry_date   Date string (YYYY-MM-DD).
 * @apiParam {String} [entry.mood]       Mood rating (can be a number or text).
 * @apiParam {Number} [entry.weight]     Body weight (can be given as a float, but will round up or down to the nearest integer).
 * @apiParam {Number} [entry.sleep_hours] Hours of sleep (can be given as a float, but will round up or down to the nearest integer).
 * @apiParam {String} [entry.notes]      Free-text notes.
 *
 * @apiSuccess {Number} entry_id  The `insertId` of the newly created row.
 * @apiSuccessExample {json} Resolved value (success):
 *   { "entry_id": 42 }
 *
 * @apiError {Object} error  Database error message string (`e.message`).
 * @apiErrorExample {json} Resolved value (error):
 *   { "error": "ER_DUP_ENTRY: Duplicate entry for key 'PRIMARY'" }
 *
 * @apiDescription Optional fields (`mood`, `weight`, `sleep_hours`, `notes`) are passed
 *  directly to the parameterised query even when `undefined`. MySQL will store
 *  `NULL` for undefined values — ensure the table columns are nullable.
 *  The queries should match specifically what table names are set in SQL,
 *  unless you have set the `lower_case_table_names` setting in MySQL
 */
const addEntry = async (entry) => {
  const {user_id, entry_date, mood, weight, sleep_hours, notes} = entry;
  const sql = `INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, weight, sleep_hours, notes];
  try {
    const rows = await promisePool.execute(sql, params);
    // console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

/**
 * @api {db} diaryEntries/delete Remove Entry by ID and User
 * @apiVersion 1.0.0
 * @apiName removeEntryById
 * @apiGroup EntryModel
 * @apiDescription Executes `DELETE FROM DiaryEntries WHERE entry_id = ? AND user_id = ?`
 *   using a parameterised statement. Combines both `entryId` and `userId` to prevent
 *   users from deleting entries that belong to others.
 *   Returns the number of affected rows (0 or 1).
 *
 * @apiParam {Number} entryId  ID of the entry to delete.
 * @apiParam {Number} userId   ID of the user performing the deletion (from JWT).
 *
 * @apiSuccess {Number} affectedRows  Number of rows deleted: `1` on success, `0` if not found
 *   or the entry belongs to a different user.
 *
 * @apiSuccessExample Resolved value (deleted):
 *   1
 *
 * @apiSuccessExample Resolved value (not found / wrong owner):
 *   0
 *
 * @apiDescription Unlike other model functions, `removeEntryById` does NOT have a try/catch block.
 *  This is because in the client view, each entry has their own dynamically generated delete button that only works for that entry.
 *  Executing the API with an ID that doesn't exist with a test request would simply return a null and nothing would happen.
 *  Any database error will propagate as an unhandled rejection to the caller.
 */

const removeEntryById = async(entryId, userId) => {
  const sqlhaku = 'delete from DiaryEntries where entry_id = ? and user_id = ?';
  const [tulos] = await promisePool.execute(sqlhaku, [entryId, userId]);
  return tulos.affectedRows;
}

export {listAllEntries, findEntryById, addEntry, removeEntryById};
