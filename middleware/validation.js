
const userValidation = require('./userValidation')
const creditCardValidation = require('./creditCardValidation')
const transactionValidation = require('./transactionValidation')
const disputeValidation = require('./disputeValidation');


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
    res.status(400).send({
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
    res.status(400).send({
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};


/**
 * transaction validator
 */
const validateTransaction = async (req, res, next) => {
  try {
    req.body = await transactionValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (err) {
    const formattedErrors = err.inner.map(e => ({
      field: e.path,
      message: e.message
    }));
    res.status(400).send({
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};

/**
 * dispute validator
 */
const validateDispute = async (req, res, next) => {
  try {
    req.body = await disputeValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    next();
  } catch (err) {
    const formattedErrors = err.inner.map(e => ({
      field: e.path,
      message: e.message
    }));
    res.status(400).send({
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};

module.exports = { saveuser, savecreditcard, validateTransaction, validateDispute };
