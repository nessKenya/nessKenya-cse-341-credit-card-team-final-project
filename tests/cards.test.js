const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

// Mock your getDb function
jest.mock('../config/connect', () => ({
  getDb: jest.fn()
}));

const { getDb } = require('../config/connect');
const creditCardController = require('../controllers/creditCardController')

// Set up a test Express app and attach the route
const app = express();
app.get('/cards/:id', creditCardController.getOne);
app.get('/cards', creditCardController.getAll);

describe('GET specific credit card by id', () => {
  it('should return credit card data with 200 status', async () => {
    const fakeId = new ObjectId();
    const fakeCard = {
      "userId": { "$oid": "65fb1a001234567890abcdef" },
      "cardType": "Visa",
      "cardBrand": "Chase Freedom",
      "cardNumberMasked": "**** **** **** 1234",
      "last4": "1234",
      "expiration": { "month": 12, "year": 2026 },
      "isPrimary": true,
      "createdAt": { "$date": "2025-03-20T10:05:00Z" },
      "updatedAt": { "$date": "2025-03-20T10:05:00Z" }
    };

    // Mock DB response
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(fakeCard),
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/cards/${fakeId.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      cardType: "Visa",
      cardBrand: "Chase Freedom",
      cardNumberMasked: "**** **** **** 1234",
      last4: "1234",
    }));

    expect(getDb).toHaveBeenCalled();
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 404 if credit card not found', async () => {
    const fakeId = new ObjectId();

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null), // Simulate not found
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/cards/${fakeId.toString()}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });

    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 500 on DB error', async () => {
    const fakeId = new ObjectId();

    getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockRejectedValue(new Error('DB error')),
      })
    });

    const res = await request(app).get(`/cards/${fakeId.toString()}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});

describe('GET credit card listing', () => {
  it('should return all credit cards with 200 status', async () => {
    const fakeCards = [
      {
        "userId": { "$oid": "65fb1a001234567890abcdef" },
        "cardType": "Visa",
        "cardBrand": "Chase Freedom",
        "cardNumberMasked": "**** **** **** 1234",
        "last4": "1234",
        "expiration": { "month": 12, "year": 2026 },
        "isPrimary": true,
        "createdAt": { "$date": "2025-03-20T10:05:00Z" },
        "updatedAt": { "$date": "2025-03-20T10:05:00Z" }
      },
      {
        "userId": { "$oid": "65fb1a001234567890abcdf0" },
        "cardType": "MasterCard",
        "cardBrand": "Citi Double Cash",
        "cardNumberMasked": "**** **** **** 5678",
        "last4": "5678",
        "expiration": { "month": 9, "year": 2025 },
        "isPrimary": true,
        "createdAt": { "$date": "2025-03-20T11:05:00Z" },
        "updatedAt": { "$date": "2025-03-20T11:05:00Z" }
      }
    ]

    const mockCursor = {
      toArray: jest.fn().mockResolvedValue(fakeCards)
    };

    const mockCollection = {
      find: jest.fn(() => mockCursor)
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get('/cards');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeCards);
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

    const res = await request(app).get('/cards');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});
