require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport'); // Your passport config
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./docs/swagger-output.json');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const app = express();

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

// DB connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
