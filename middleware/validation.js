
const userValidation = require('./userValidation')
const creditCardValidation = require('./creditCardValidation')
<<<<<<< HEAD
=======
const transactionValidation = require('./transactionValidation')
const disputeValidation = require('./disputeValidation');
>>>>>>> 4f96c32fb8628f8cdb334dfc1f7572544ac54510


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
<<<<<<< HEAD
    res.status(412).send({
=======
    res.status(400).send({
>>>>>>> 4f96c32fb8628f8cdb334dfc1f7572544ac54510
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
<<<<<<< HEAD
    res.status(412).send({
=======
    res.status(400).send({
>>>>>>> 4f96c32fb8628f8cdb334dfc1f7572544ac54510
      success: false,
      message: 'Validation failed',
      data: formattedErrors
    });
  }
};
<<<<<<< HEAD
module.exports = { saveuser, savecreditcard };
=======


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
>>>>>>> 4f96c32fb8628f8cdb334dfc1f7572544ac54510
