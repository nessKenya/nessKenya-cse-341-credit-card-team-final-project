const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const { initDb } = require('./config/connect'); 
const usersRoute = require('./routes/usersRoute');
const creditcardRoute = require('./routes/creditcardRoute')
const transactionRoute = require('./routes/transactionRoute')
const disputeRoute = require('./routes/disputeRoute')
const authRoute = require('./routes/auth')
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const swaggerDocument = require('./swagger-output.json');
const bodyParser = require('body-parser');


// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middleware to serve frontend static files
app.use(express.static(path.join(__dirname, './cse341-project2')));
app.use(express.json());

// Use routes
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
  });

app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRoute);
app.use('/cards', creditcardRoute);
app.use('/transactions', transactionRoute)
app.use('/disputes', disputeRoute)
app.use('/', authRoute)

const port = 8080;

process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n + Exception origin: ${origin}`)
});

// Initialize the database before starting the server
initDb()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Swagger Docs available at /api-docs`)
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });