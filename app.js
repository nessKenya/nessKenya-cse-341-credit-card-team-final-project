require('dotenv').config();
require('./config/passport'); 
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { initDb } = require('./models/connect'); 
const Routes = require('./routes/index');
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const passport = require('passport');
const authRoutes = require('./routes/auth');
const swaggerFile = require('./docs/swagger-output.json');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const bodyParser = require('body-parser');
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy;



app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Example route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Swagger setup


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to serve frontend static files
app.use(express.static(path.join(__dirname, './cse341-credit-card-team-final-project')));

// Use routes
app
  .use (cors())
  .use(bodyParser.json())
  .use(express.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  // This is the basic express session({...}) initialization.
  .use(passport.initialize())
  // init passport on every route call.
  .use(passport.session())
  // allow passport to use "express-session"
  .use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
  })
  .use("/", Routes)

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {
      console.log('Access Token:', accessToken);
      console.log('GitHub Profile:', profile);
    return done(null, profile);
  }
  ))  
  
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
  
  app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
  });
  
  
  app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs'}),
    (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  })
  
  

// Start server & Initialize the database before starting the server

const PORT = process.env.PORT;
initDb()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on localhost:${PORT}`);
      console.log(`Swagger Docs available at localhost:${PORT}/api-docs`)
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
