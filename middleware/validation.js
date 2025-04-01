
const userValidation = require('./userValidation')
const creditCardValidation = require('./creditCardValidation')


// Middleware function User
const saveuser = async (req, res, next) => {
  try {
    req.body = await userValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (err) {
    const formattedErrors = err.inner.map(e => ({
      field: e.path,
      message: e.message
    }));
    res.status(412).send({
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};

// Middleware function Credit Card
const savecreditcard = async (req, res, next) => {
  try {
    req.body = await creditCardValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (err) {
    const formattedErrors = err.inner.map(e => ({
      field: e.path,
      message: e.message
    }));
    res.status(412).send({
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};
module.exports = { saveuser, savecreditcard };
