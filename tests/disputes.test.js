const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

// Mock your getDb function
jest.mock('../config/connect', () => ({
  getDb: jest.fn()
}));

const { getDb } = require('../config/connect');
const disputeController = require('../controllers/disputeController')

// Set up a test Express app and attach the route
const app = express();
app.get('/disputes/:id', disputeController.getOne);
app.get('/disputes', disputeController.getAll);

describe('GET specific dispute by id', () => {
  it('should return disputes data with 200 status', async () => {
    const fakeId = new ObjectId();
    const fakeDispute =  {
        "_id": "67ed83861a0f791ec7f22a02",
        "transactionId": "67ed83561a0f791ec7f22a01",
        "status": "Submitted",
        "description": "Double Payment",
        "createdAt": "2025-04-02T18:35:50.406Z",
        "updatedAt": "2025-04-02T18:35:50.406Z"
      }
    

    // Mock DB response
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(fakeDispute),
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/disputes/${fakeId.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
        "transactionId": "67ed83561a0f791ec7f22a01",
        "status": "Submitted",
        "description": "Double Payment",
        "createdAt": "2025-04-02T18:35:50.406Z",
    }));

    expect(getDb).toHaveBeenCalled();
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 404 if dispute not found', async () => {
    const fakeId = new ObjectId();

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null), // Simulate not found
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/disputes/${fakeId.toString()}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });

    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

   it('should return 400 if id is invalid', async () => {
      const invalidId = 'not_a_valid_objectid';
    
      const res = await request(app).get(`/disputes/${invalidId}`);
    
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

    const res = await request(app).get(`/disputes/${fakeId.toString()}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});

describe('GET disputes listing', () => {
  it('should return all dispute with 200 status', async () => {
    const fakeDisputes = [
      {
        "_id": "67ed83861a0f791ec7f22a02",
        "transactionId": "67ed83561a0f791ec7f22a01",
        "status": "Submitted",
        "description": "Double Payment",
        "createdAt": "2025-04-02T18:35:50.406Z",
        "updatedAt": "2025-04-02T18:35:50.406Z"
      }
    ]

    const mockCursor = {
      toArray: jest.fn().mockResolvedValue(fakeDisputes)
    };

    const mockCollection = {
      find: jest.fn(() => mockCursor)
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get('/disputes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeDisputes);
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

    const res = await request(app).get('/disputes');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});
