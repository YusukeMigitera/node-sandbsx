import express from 'express';
import session from 'express-session';
import router from './routes/index.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
  })
);
app.use('/', router);

app.listen(3000, console.log('Server listening port 3000...'));
