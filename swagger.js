const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation with Swagger Autogen',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication routes'
    }
  ]
};

const outputFile = './docs/swagger-output.json';
const endpointsFiles = ['./app.js', './routes/auth.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
