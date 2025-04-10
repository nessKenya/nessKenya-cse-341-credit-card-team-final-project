const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

// Mock your getDb function
jest.mock('../config/connect', () => ({
  getDb: jest.fn()
}));

const { getDb } = require('../config/connect');
const usersController = require('../controllers/usersController')

// Set up a test Express app and attach the route
const app = express();
app.get('/users/:id', usersController.getOne);
app.get('/users', usersController.getAll);

describe('GET specific user by id', () => {
  it('should return user data with 200 status', async () => {
    const fakeId = new ObjectId();
    const fakeUser =  {
      "_id": { "$oid": "65fb1a001234567890abcdef" },
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@example.com",
      "phone": "+1-555-101-2020",
      "address": {
        "street": "100 Apple Lane",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "country": "USA"
      },
      "createdAt": { "$date": "2025-03-20T10:00:00Z" },
      "updatedAt": { "$date": "2025-03-20T10:00:00Z" }
    };

    // Mock DB response
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(fakeUser),
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/users/${fakeId.toString()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@example.com",
    }));

    expect(getDb).toHaveBeenCalled();
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: fakeId });
  });

  it('should return 404 if user not found', async () => {
    const fakeId = new ObjectId();

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null), // Simulate not found
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get(`/users/${fakeId.toString()}`);

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

    const res = await request(app).get(`/users/${fakeId.toString()}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});

describe('GET users listing', () => {
  it('should return all users with 200 status', async () => {
    const fakeUsers = [
      {
        "_id": { "$oid": "65fb1a001234567890abcdef" },
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice.johnson@example.com",
        "phone": "+1-555-101-2020",
        "address": {
          "street": "100 Apple Lane",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94105",
          "country": "USA"
        },
        "createdAt": { "$date": "2025-03-20T10:00:00Z" },
        "updatedAt": { "$date": "2025-03-20T10:00:00Z" }
      },
      {
        "_id": { "$oid": "65fb1a001234567890abcdf0" },
        "firstName": "Brian",
        "lastName": "Lee",
        "email": "brian.lee@example.com",
        "phone": "+1-555-303-4040",
        "address": {
          "street": "42 Banana Street",
          "city": "Los Angeles",
          "state": "CA",
          "postalCode": "90001",
          "country": "USA"
        },
        "createdAt": { "$date": "2025-03-20T11:00:00Z" },
        "updatedAt": { "$date": "2025-03-20T11:00:00Z" }
      }
    ]

    const mockCursor = {
      toArray: jest.fn().mockResolvedValue(fakeUsers)
    };

    const mockCollection = {
      find: jest.fn(() => mockCursor)
    };

    getDb.mockReturnValue({ collection: () => mockCollection });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeUsers);
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

    const res = await request(app).get('/users');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });
});
