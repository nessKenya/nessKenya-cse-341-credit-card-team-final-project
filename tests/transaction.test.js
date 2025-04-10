const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

// Mock your getDb function
jest.mock('../config/connect', () => ({
  getDb: jest.fn()
}));

const { getDb } = require('../config/connect');
const transactionController = require('../controllers/transactionController')

// Set up a test Express app and attach the route
const app = express();
app.get('/transactions/:id', transactionController.getOne);
app.get('/transactions', transactionController.getAll);

describe('GET specific transaction by id', () => {
  it('should return transactions data with 200 status', async () => {
    const fakeId = new ObjectId();
    const fakeTransaction =    {
      "_id": "67ea90d86142840cfda00323",
      "cardId": "67ea89a77bb75f05e4c48ecd",
      "amount": 7865524,
      "charges": 130,
      "status": "Progress",
      "description": "Wage",
      "createdAt": "2025-03-31T12:55:52.370Z",
      "updatedAt": "2025-03-31T12:55:52.370Z"
    }

    // Mock DB response
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(fakeTransaction),
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/transactions/${fakeId.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      "cardId": "67ea89a77bb75f05e4c48ecd",
      "amount": 7865524,
      "charges": 130,
      "status": "Progress",
      "description": "Wage",
    }));

    expect(getDb).toHaveBeenCalled();
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 404 if transaction not found', async () => {
    const fakeId = new ObjectId();

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null), // Simulate not found
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/transactions/${fakeId.toString()}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });

    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 400 if id is invalid', async () => {
    const invalidId = 'not_a_valid_objectid';
  
    const res = await request(app).get(`/transactions/${invalidId}`);
  
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'invalid id' });
  });

  it('should return 500 on DB error', async () => {
    const fakeId = new ObjectId();

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockRejectedValue(new Error('DB error')),
      })
    });

    const res = await request(app).get(`/transactions/${fakeId.toString()}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});

describe('GET transactions listing', () => {
  it('should return all transaction with 200 status', async () => {
    const fakeTransactions = [
      {
        "_id": "67ea90d86142840cfda00323",
        "cardId": "67ea89a77bb75f05e4c48ecd",
        "amount": 7865524,
        "charges": 130,
        "status": "Progress",
        "description": "Wage",
        "createdAt": "2025-03-31T12:55:52.370Z",
        "updatedAt": "2025-03-31T12:55:52.370Z"
      },
      {
        "_id": "67ed83561a0f791ec7f22a01",
        "cardId": "67ea89a77bb75f05e4c48ecd",
        "amount": 3500,
        "charges": 34,
        "status": "Progress",
        "description": "Payment",
        "createdAt": "2025-04-02T18:35:02.897Z",
        "updatedAt": "2025-04-02T18:35:02.897Z"
      }
    ]

    const mockCursor = {
      toArray: jest.fn().mockResolvedValue(fakeTransactions)
    };

    const mockCollection = {
      find: jest.fn(() => mockCursor)
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get('/transactions');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeTransactions);
    expect(getDb).toHaveBeenCalled();
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCursor.toArray).toHaveBeenCalled();
  });

  it('should return 500 on DB error', async () => {
    getDb.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: jest.fn().mockRejectedValue(new Error('DB Error'))
        })
      })
    });

    const res = await request(app).get('/transactions');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});
