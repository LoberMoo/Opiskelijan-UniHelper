import express from 'express';
import {body} from 'express-validator';
import {getEntries, getEntryById, postEntry, deleteEntry} from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';

/**
 * @apiDefine APIIntro
 *
 * ## Introduction
 * The **Diary API** allows authenticated users to create, read, and delete
 * personal diary entries. Each entry can record the date, mood, weight,
 * sleep hours, and free-text notes for a given day.
 *
 * **Base URL:** `https://<your-domain>/api/entries`
 * _(Replace `<your-domain>` with your deployed hostname. The `/api` prefix
 *  and port are assumed from typical Express configuration — confirm with
 *  your server's `app.js` / `index.js`.)_
 *
 * ---
 *
 * ## Authentication
 * All protected endpoints use **JWT Bearer Token** authentication.
 * Obtain a token from the authentication endpoint (defined elsewhere in
 * the project) and include it in every protected request:
 *
 * ```
 * Authorization: Bearer <token>
 * ```
 *
 * The token is validated by the `authenticateToken` middleware. The decoded
 * payload must contain a `user_id` field, which the API uses to scope
 * all data operations to the owning user.
 *
 * **Token expiry, refresh flow, and the login/register endpoints are defined
 * in a separate auth router not covered in this file.**
 *
 * ---
 *
 * ## Common Error Codes
 *
 * | Code | Meaning                                                          |
 * |------|------------------------------------------------------------------|
 * | 400  | Bad Request – missing or invalid fields in the request body.    |
 * | 401  | Unauthorized – missing or invalid JWT token.                    |
 * | 404  | Not Found – requested entry does not exist.                     |
 * | 500  | Internal Server Error – unexpected database or server failure.  |
 *
 * ---
 *
 * ## Rate Limits
 * No rate limiting is configured in the current implementation.
 * Add details here once throttling middleware (e.g., `express-rate-limit`)
 * is applied.
 *
 * ---
 *
 * ## Changelog
 * | Version | Date       | Notes                            |
 * |---------|------------|----------------------------------|
 * | 1.0.0   | 2026-05-06 | Initial release.                 |
 *
 * ---
 *
 * ## Terms of Use / Contact
 * Free to use and distribute, contact joni.kaukinen@metropolia.fi for any information
 */

const entryRouter = express.Router();

entryRouter.route('/').get(authenticateToken, getEntries).post(authenticateToken,
  body('entry_date').isDate(),
  validationErrorHandler,
  postEntry);

entryRouter.route('/:id').get(getEntryById).delete(authenticateToken, deleteEntry);


export default entryRouter;
