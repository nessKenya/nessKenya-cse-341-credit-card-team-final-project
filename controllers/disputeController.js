const { getDb } = require('../config/connect');
const { ObjectId } = require('mongodb')

const dispute = {}

dispute.getAll = async (req, res) => {
  try {
      const db = getDb();
      const dispute = await db.collection('dispute').find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(dispute);
  } catch (error) {
      // console.error("Error fetching disputes:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

dispute.getOne = async (req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }

  try {
    const db = getDb();
    const disputeId = new ObjectId(req.params.id);
    const dispute = await db.collection('dispute').findOne({_id:disputeId});
    if(!dispute){
      return res.status(404).json({error: 'Not found'})
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(dispute);
  } catch (error) {
    // console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  };
};

dispute.createDispute = async(req, res) => {
  try {
    const db = getDb();
    const dispute = {
      transactionId: req.body.transactionId, 
      status: req.body.status,
      description: req.body.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const response = await db.collection('dispute').insertOne(dispute);
    if (response.insertedId) {
      res.status(201).json({message: "Dispute recorded successfully", disputeId: response.insertedId});
    } else {
      res.status(400).json(response.error) || 'Some error occured while recording the dispute'
    }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

dispute.updateDispute = async(req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }

  try {
    const db = getDb();
    const disputeId = new ObjectId(req.params.id);
    const dispute = {
      transactionId: req.body.transactionId, 
      status: req.body.status,
      description: req.body.description,
      updatedAt: new Date()
    };
    const response = await db.collection('dispute').replaceOne({_id: disputeId}, dispute);
    if (response.modifiedCount > 0) {
      res.status(200).json({msg: 'Updated successfully'});
    } else {
      res.status(400).json(response.modifiedCount) || 'Some error occured while adding the user'
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  };
};

dispute.deleteDispute = async(req, res) => {
  // id validation
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'invalid id'})
  }
  
  try {
    const db = getDb();  
    const disputeId = req.params.id;
    if (!ObjectId.isValid(disputeId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const response = await db.collection('dispute').deleteOne({_id: new ObjectId(disputeId)});
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({error: "Dispute not found"})
    }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  };
};

module.exports = dispute;