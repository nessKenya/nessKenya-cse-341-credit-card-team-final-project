const yup = require('yup');

const disputeSchema = yup.object({
  transactionId: yup
                  .string()
                  .test('is-objectid', 'Invalid ObjectId', (value) => 
                    typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
                  )
                  .required(), 
  status: yup.string().required(),
  description: yup.string().required(),
});

module.exports = disputeSchema;
