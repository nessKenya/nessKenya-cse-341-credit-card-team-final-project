
const { getDb } = require('../config/connect');
const { ObjectId } = require('mongodb')

const creditcard = {}

creditcard.getAll = async (req, res) => {
  try {
      const db = getDb();
      const creditcard = await db.collection('creditcard').find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(creditcard);
  } catch (error) {
      console.error("Error fetching credit cards:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

creditcard.getOne = async (req, res) => {

  try {
    const db = getDb();
    const creditcardId = new ObjectId(req.params.id);
    const creditcard = await db.collection('creditcard').findOne({_id:creditcardId});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(creditcard);
} catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
};
};

creditcard.createCreditCard = async(req, res) => {
  try {
    const db = getDb();
    const creditcard = {
      userId: req.body.userId, 
      cardType: req.body.cardType,
      cardBrand: req.body.cardBrand,
      cardNumberMasked: req.body.cardNumberMasked,
      last4: req.body.last4,
      expiration: req.body.expiration 
    };
    const response = await db.collection('creditcard').insertOne(creditcard);
    if (response.insertedId) {
      res.status(201).json({message: "Credit card added successfully", creditcardId: response.insertedId});
    } else {
      res.status(500).json(response.error) || 'Some error occured while adding the user'
    }
    } catch (error) {
      console.error("Error fetching user:", error.message);
    };
  };

creditcard.updateCreditCard = async(req, res) => {
  try {
  const db = getDb();
  const creditcardId = new ObjectId(req.params.id);
  const creditcard = {
    userId: req.body.userId, 
    cardType: req.body.cardType,
    cardBrand: req.body.cardBrand,
    cardNumberMasked: req.body.cardNumberMasked,
    last4: req.body.last4,
    expiration: req.body.expiration 
  };
  const response = await db.collection('creditcard').replaceOne({_id: creditcardId}, creditcard);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.modifiedCount) || 'Some error occured while adding the user'
  }
  } catch (error) {
    console.error("Error fetching contact:", error);
  };
  };

creditcard.deleteCreditCard = async(req, res) => {
  try {
    const db = getDb();  
    const creditcardId = req.params.id;
    if (!ObjectId.isValid(creditcardId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const response = await db.collection('creditcard').deleteOne({_id: new ObjectId(creditcardId)});
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({error: "User not found"})
    }
    } catch (error) {
      console.error("Error fetching contact:", error.message);
    };
  };

module.exports = creditcard;
