import express from 'express';
import {body} from 'express-validator';
import {getEntries, getEntryById, postEntry, deleteEntry} from '../controllers/entry-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';

const entryRouter = express.Router();

entryRouter.route('/').get(authenticateToken, getEntries).post(authenticateToken,
  body('entry_date').isDate(),
  validationErrorHandler,
  postEntry);

entryRouter.route('/:id').get(getEntryById).delete(authenticateToken, deleteEntry);


export default entryRouter;
