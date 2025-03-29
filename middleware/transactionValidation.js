const yup = require('yup');

const transactionSchema = yup.object({
  cardId: yup
            .string()
            .test('is-objectid', 'Invalid ObjectId', (value) => 
              typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
            )
            .required(),
  amount: yup.number().integer().required(),
  charges: yup.number().integer().required(),
  status: yup.string().required(),
  description: yup.string().required(),
});

module.exports = transactionSchema;