
const { getDb } = require('../config/connect');
const { ObjectId } = require('mongodb')

const transaction = {}

transaction.getAll = async (req, res) => {
  try {
      const db = getDb();
      const transaction = await db.collection('transaction').find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(transaction);
  } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

transaction.getOne = async (req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }

  try {
    const db = getDb();
    const transactionId = new ObjectId(req.params.id);
    const transaction = await db.collection('transaction').findOne({_id:transactionId});
    if(!transaction){
      return res.status(404).json({error: 'Not found'})
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(transaction);
} catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
};
};

transaction.createTransaction = async(req, res) => {
  try {
    const db = getDb();
    const transaction = {
      cardId: req.body.cardId, 
      amount: req.body.amount,
      charges: req.body.charges,
      status: req.body.status,
      description: req.body.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const response = await db.collection('transaction').insertOne(transaction);
    if (response.insertedId) {
      res.status(201).json({message: "transaction recorded successfully", transactionId: response.insertedId});
    } else {
      res.status(400).json(response.error) || 'Some error occured while recording the transaction'
    }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
  };

transaction.updateTransaction = async(req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }

  try {
  const db = getDb();
  const transactionId = new ObjectId(req.params.id);
  const transaction = {
    cardId: req.body.cardId, 
    amount: req.body.amount,
    charges: req.body.charges,
    status: req.body.status,
    description: req.body.description,
    updatedAt: new Date()
  };
  const response = await db.collection('transaction').replaceOne({_id: transactionId}, transaction);
  if (response.modifiedCount > 0) {
    res.status(200).send({msg: `${transactionId} updated succesfully`});
  } else {
    res.status(400).json(response.modifiedCount) || 'Some error occured while adding the user'
  }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  };
};

transaction.deleteTransaction = async(req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }
  
  try {
    const db = getDb();  
    const transactionId = req.params.id;
    if (!ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const response = await db.collection('transaction').deleteOne({_id: new ObjectId(transactionId)});
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({error: "transaction not found"})
    }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    };
  };

module.exports = transaction;
