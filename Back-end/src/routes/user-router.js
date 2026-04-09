import express from 'express';
import {body} from 'express-validator';
import {haeuserbyId,haeuserit, postUser} from '../controllers/user-controller.js';
import {getMe, postLogin} from '../controllers/kubios-auth-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter.route('/')


// GET all users
  .get(haeuserit)

// // POST new user
  .post(body('username').isLength({min: 3, max: 20}).isAlphanumeric(),
  body('password').isLength({min: 8, max: 100}),
  body('email').isEmail(),
  validationErrorHandler,
  postUser,
);


// GET user by ID
userRouter.route('/:id').get(haeuserbyId);

// POST user login
userRouter.post('/login', postLogin);


// Get user router info based on token
userRouter.get('/me', authenticateToken, getMe);


// TODO: delete user by id

export default userRouter;
