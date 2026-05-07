/**
 * @api {use} * AuthenticateToken
 * @apiName authenticateToken
 * @apiGroup Authentication
 * @apiVersion 1.2.0
 *
 * @apiDescription
 * Middleware that protects routes by validating a JSON Web Token (JWT)
 * included in the request's Authorization header. This middleware must be
 * applied to any route that requires the user to be authenticated.
 *
 * When a request is received, the middleware extracts the Bearer token from
 * the Authorization header, verifies its signature against the server's
 * JWT_SECRET environment variable, and, if valid, attaches the decoded
 * user payload to `req.user` before passing control to the next handler.
 *
 * If no token is present the request is rejected with HTTP 401.
 * If the token is present but invalid or expired, the request is rejected
 * with HTTP 403.
 *
 * This middleware is being used to protect routes
 * that are being used in logging in and other API calls
 *
 * @apiHeader {String} Authorization Bearer-token format:
 *   <code>Authorization: Bearer &lt;token&gt;</code>
 *
 * @apiHeaderExample {json} Example:
 *   {
 *     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 *
 * @apiSuccess (middleware) {Object} req.user
 *   Decoded JWT payload attached to the request object and forwarded to the
 *   next middleware or route handler.
 *
 * @apiSuccessExample {json} Token accepted, API call continues:
 *   HTTP/1.1 200 OK (passes through to the protected route handler)
 *   req.user = {
 *     "id": 1,
 *     "username": "example_usr",
 *   }
 *
 * @apiError (401) Unauthorized Token missing from Authorization.
 *
 * @apiErrorExample {text} Error - token missing (401):
 *   HTTP/1.1 401 Unauthorized
 *
 * @apiError (403) Forbidden Token is incorrect or expired.
 *
 * @apiErrorExample {json} Error - invalid token (403):
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "message": "invalid token"
 *   }
 */

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  //console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //console.log('token', token);
  if (token == undefined) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log('token verification failed', error);
    res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};
