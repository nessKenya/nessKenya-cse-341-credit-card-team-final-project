
const { getDb } = require('../config/connect');
const { ObjectId } = require('mongodb')

const users = {}

users.getAll = async (req, res) => {
  try {
      const db = getDb();
      const users = await db.collection('users').find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

users.getOne = async (req, res) => {

  try {
    const db = getDb();
    const userId = new ObjectId(req.params.id);
    const users = await db.collection('users').findOne({_id:userId});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
} catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
};
};

users.createUser = async(req, res) => {
  try {
    const db = getDb();
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };
    const response = await db.collection('users').insertOne(user);
    if (response.insertedId) {
      res.status(201).json({message: "User added successfully", userId: response.insertedId});
    } else {
      res.status(500).json(response.error) || 'Some error occured while adding the user'
    }
    } catch (error) {
      console.error("Error fetching user:", error.message);
    };
  };

users.updateUser = async(req, res) => {
  try {
  const db = getDb();
  const userId = new ObjectId(req.params.id);
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address
  };
  const response = await db.collection('users').replaceOne({_id: userId}, user);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.modifiedCount) || 'Some error occured while adding the user'
  }
  } catch (error) {
    console.error("Error fetching contact:", error);
  };
  };

users.deleteUser = async(req, res) => {
  try {
    const db = getDb();  
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const response = await db.collection('users').deleteOne({_id: new ObjectId(userId)});
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({error: "User not found"})
    }
    } catch (error) {
      console.error("Error fetching contact:", error.message);
    };
  };

module.exports = users;
