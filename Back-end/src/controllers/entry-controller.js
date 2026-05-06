import {listAllEntries, findEntryById, addEntry, removeEntryById} from "../models/entry-model.js";

/**
 * @apiDefine AuthHeader
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiHeaderExample {json} Authorization Header:
 *   { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 */

/**
 * @apiDefine EntryNotFoundError
 * @apiError (404) {String} message Entry not found.
 * @apiErrorExample {json} 404 Not Found:
 *   HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine InternalServerError
 * @apiError (500) {Object} error Internal server error message from the database layer.
 * @apiErrorExample {json} 500 Internal Server Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Database connection failed"
 *   }
 */


/**
 * @api {get} {api_url}/entries/ Get All Entries
 * @apiVersion 1.0.0
 * @apiName GetEntries
 * @apiGroup Entries
 * @apiDescription Retrieves all diary entries belonging to the currently authenticated user.
 *   The user is identified via the JWT token attached to the request.
 *   Only entries that match the token's `user_id` are returned.
 *
 * @apiUse AuthHeader
 *
 * @apiSuccess {Object[]} entries             Array of diary entry objects.
 * @apiSuccess {Number}   entries.entry_id    Unique identifier of the entry.
 * @apiSuccess {Number}   entries.user_id     ID of the user who owns the entry.
 * @apiSuccess {String}   entries.entry_date  Date of the diary entry (YYYY-MM-DD).
 * @apiSuccess {String}   [entries.mood]      Mood rating (Can be anything the user desires, whether it's a number from 1 to 10 or just a simple description of their mood like "Happy").
 * @apiSuccess {Number}   [entries.weight]    Body weight recorded for the day. (whole number, preferrably in Kg as that's what is displayed in the client view)
 * @apiSuccess {Number}   [entries.sleep_hours] Hours of sleep recorded (whole number for hours of sleep, will round up or down to the closest integer in case of floats).
 * @apiSuccess {String}   [entries.notes]     Free-text notes for the entry. (There is no limit for what you can write)
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "entry_id": 12,
 *       "user_id": 3,
 *       "entry_date": "2026-05-06",
 *       "mood": "Happy",
 *       "weight": 75,
 *       "sleep_hours": 7,
 *       "notes": "Feeling good today."
 *     }
 *   ]
 *
 * @apiUse InternalServerError
 *
 * @apiDescription Returns an empty array `[]` if the user has no entries.
 */

const getEntries = async (req, res) => {
  const result = await listAllEntries(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

/**
 * @api {get} {api_url}/entries/:id Get Entry by ID
 * @apiVersion 1.0.0
 * @apiName GetEntryById
 * @apiGroup Entries
 * @apiDescription Retrieves a single diary entry by its unique `entry_id`.
 *   This endpoint does NOT require authentication, meaning any caller who
 *   knows a valid `entry_id` can retrieve that entry regardless of ownership.
 *
 * @apiParam {Number} id  The unique numeric ID of the entry (URL path parameter).
 *
 * @apiSuccess {Number}  entry_id     Unique identifier of the entry.
 * @apiSuccess {Number}  user_id      ID of the user who owns the entry.
 * @apiSuccess {String}  entry_date   Date of the diary entry (YYYY-MM-DD).
 * @apiSuccess {String}   [entries.mood]      Mood rating (Can be anything the user desires, whether it's a number from 1 to 10 or just a simple description of their mood like "Happy").
 * @apiSuccess {Number}   [entries.weight]    Body weight recorded for the day. (whole number, preferrably in Kg as that's what is displayed in the client view)
 * @apiSuccess {Number}   [entries.sleep_hours] Hours of sleep recorded (whole number for hours of sleep, will round up or down to the closest integer in case of floats).
 * @apiSuccess {String}   [entries.notes]     Free-text notes for the entry. (There is no limit for what you can write)
 *
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   {
 *     "entry_id": 12,
 *     "user_id": 3,
 *     "entry_date": "2026-05-06",
 *     "mood": Happy,
 *     "weight": 75,
 *     "sleep_hours": 7,
 *     "notes": "Feeling good today."
 *   }
 *
 * @apiUse EntryNotFoundError
 *
 * @apiDescription This endpoint isn't used in the current version of the webapp because all the entires are fetched at the same time, there is current no function in the client to search for specific entries.
 *  No authorization check is performed; any authenticated or
 *  unauthenticated user can access entries by ID.
 */

const getEntryById = async (req, res) => {
  const entry = await findEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    res.sendStatus(404);
  }
};

/**
 * @api {post} {api_url}/entries/ Create New Entry
 * @apiVersion 1.0.0
 * @apiName PostEntry
 * @apiGroup Entries
 * @apiDescription Creates a new diary entry for the authenticated user.
 *   `entry_date` is mandatory. At least one of `mood`, `weight`, `sleep_hours`,
 *   or `notes` must also be present. The `user_id` is taken from the JWT token.
 *
 * @apiUse AuthHeader
 *
 * @apiBody {String}  entry_date             Date of the entry (YYYY-MM-DD). **Required, but automatically aquired in the client so it doesn't need user input.**
 * @apiBody {String}  [mood]                 Mood rating. **Required**
 * @apiBody {Number}  [weight]               Body weight as an integer. **Required**
 * @apiBody {Number}  [sleep_hours]          Hours of sleep as an integer. **Required**
 * @apiBody {String}  [notes]                Free-text notes. **Required**
 *
 * @apiParamExample {json} Request Body:
 *   {
 *     "entry_date": "2024-05-01",
 *     "mood": 4,
 *     "weight": 75.5,
 *     "sleep_hours": 7,
 *     "notes": "Feeling good today."
 *   }
 *
 * @apiSuccess (201) {String} message   Confirmation message.
 * @apiSuccess (201) {Number} entry_id  ID of the newly created entry.
 *
 * @apiSuccessExample {json} 201 Created:
 *   HTTP/1.1 201 Created
 *   {
 *     "message": "New entry added.",
 *     "entry_id": 42
 *   }
 *
 * @apiError (400) BadRequest  `entry_date` missing, or none of the optional fields provided,
 *   or `entry_date` fails date validation middleware.
 * @apiErrorExample {json} 400 Bad Request:
 *   HTTP/1.1 400 Bad Request
 *
 * @apiUse InternalServerError
 */

const postEntry = async (req, res) => {
  const {entry_date, mood, weight, sleep_hours, notes} = req.body;
  const user_id = req.user.user_id;

  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {
    const result = await addEntry({user_id, ...req.body});

    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

/**
 * @api {put} /entries/:id Update Entry (Not Yet Implemented)
 * @apiVersion 1.0.0
 * @apiName PutEntry
 * @apiGroup Entries
 * @apiDescription Placeholder for a future update-entry implementation.
 *   Currently returns `200 OK` without performing any operation.
 *
 * @apiParam {Number} id  The unique numeric ID of the entry (URL path parameter).
 *
 * @apiSuccess (200) - Always returns 200 with no body.
 * @apiSuccessExample {text} 200 OK (Placeholder):
 *   HTTP/1.1 200 OK
 *
 * @apiDescription This endpoint does not yet accept a request body or modify any data.
 *  Authentication requirements are also not yet defined.
 */

const putEntry = (req, res) => {
  // placeholder for future implementation
  res.sendStatus(200);
};

/**
 * @api {delete} {api_url}/entries/:id Delete Entry
 * @apiVersion 1.0.0
 * @apiName DeleteEntry
 * @apiGroup Entries
 * @apiDescription Deletes a diary entry by its ID. The entry must belong to the
 *   authenticated user — the query matches both `entry_id` and `user_id`, so
 *   users cannot delete entries owned by others.
 *
 * @apiUse AuthHeader
 *
 * @apiParam {api_url}/entries/{Number} id  The unique numeric ID of the entry (URL path parameter).
 *
 * @apiSuccess (200) {String} message Confirmation that the entry was removed.
 * @apiSuccessExample {json} 200 OK:
 *   HTTP/1.1 200 OK
 *   {
 *     "message": "Entry poistettu"
 *   }
 *
 * @apiError (404) {String} message Entry not found or does not belong to the user.
 * @apiErrorExample {json} 404 Not Found:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "message": "Entryä ei löytynyt"
 *   }
 *
 */

const deleteEntry = async (req, res) => {
  const affectedRows = await removeEntryById(req.params.id, req.user.user_id);
  if (affectedRows > 0) {
    res.json({message: 'Entry poistettu'});
  } else {
    res.status(404).json({message: 'Entryä ei löytynyt'});
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};
