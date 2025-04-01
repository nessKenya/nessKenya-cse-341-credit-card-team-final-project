const yup = require('yup');

const creditCardSchema = yup.object({
  userId: yup.string().required(), 
  cardType: yup.string().required(),
  cardBrand: yup.string().required(),
  cardNumberMasked: yup.string().required(),
  last4: yup.string().length(4).required(),
  expiration: yup.object({
    month: yup.number().min(1).max(12).required(),
    year: yup.number().min(new Date().getFullYear()).required()
  }).required(),
  isPrimary: yup.boolean().default(false)
});

module.exports = creditCardSchema;
