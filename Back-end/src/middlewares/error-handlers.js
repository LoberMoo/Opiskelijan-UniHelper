import { validationResult } from "express-validator";


/**
 * Middleware for checking all input validation errors
 * @param {*} req http request
 * @param {*} res http response object
 * @param {*} next next function for calling next function in middleware chain
 * @returns
 */
const validationErrorHandler = (req, res, next) => {
const errors = validationResult(req, {strictParams: ['body']});
  if (!errors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 404;
    error.errors = errors.array({onlyFirstError: True}).map((error) => {
      return {field: error.path, message: error.msg};
    });
    return next(error);
  }
  next();
};


/**
 * Oletus middleware 404 pyyntöjä varten
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // forward error to error handler
};
/**
* Custom default middleware for handling errors
*/
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500); // default is 500 if err.status is not defined
  res.json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
};
export {validationErrorHandler, notFoundHandler, errorHandler};
