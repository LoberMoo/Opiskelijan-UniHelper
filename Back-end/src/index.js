import express from 'express';
import cors from 'cors';
import itemRouter from './routes/item-router.js';
import userRouter from './routes/user-router.js';
import entryRouter from './routes/entry-router.js';
import requestLogger from './middlewares/logger.js';
import kubiosRouter from './routes/kubios-router.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handlers.js';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// enable CORS requests
app.use(cors());

// parsitaan json data pyynnöstä ja lisätään request-objektiin
app.use(express.json());
// tarjoillaan webbisivusto (front-end) palvelimen juuressa
app.use('/', express.static('public'));
// Oma loggeri middleware, käytössä koko sovelluksen laajuisesti eli käsittee kaikki http-pyynnöt
app.use(requestLogger);

// API root
app.get('/api', (req, res) => {
  res.send('This is dummy items API!');
});

// Dummy items resource
app.use('/api/items', itemRouter);

// Users resource router for all /api/users routes
app.use('/api/users', userRouter);

// Patient diary router to SQL server
app.use('/api/entries', entryRouter);

 // Kubios data router
 app.use('/api/kubios', kubiosRouter);


// Käytä tätä reittiä jos haettua reittiä ei löytynyt
app.use(notFoundHandler);

// Muita virheitä varten, ylempi on 404 virheitä.
app.use(errorHandler);



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
