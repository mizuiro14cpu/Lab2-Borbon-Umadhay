import request from 'supertest';
import app from '../app';
import { clearDatabase } from './utils/db';

describe('Users API Integration test (connected to DB)', () => {
    // before each test, wipe db
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        // close connection
    })

    it('Should save a new user to the database', async () => {
        const newUser = { username: 'ybgm', email: 'ybgm@gmail.com' }

        const res = await request(app)
            .post('/api/users')
            .send(newUser)

        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeDefined();

        const dbCheck = await request(app).get('/api/users');

        expect(dbCheck.body.length).toEqual(1)
        expect(dbCheck.body[0].username).toEqual(newUser.username)
    });

    it('Should upload an array of users then search for a user in the database and return the output', async () => {
        const userList = [
            { username: 'Mr. Chedda', email: 'mrchedda@gmail.com' },
            { username: 'Grizz', email: 'grizz@gmail.com' },
            { username: 'Borgar_69', email: 'borgar@gmail.com'}
        ];

        const uploadRes = await request(app)
            .post('/api/users')
            .send(userList);
        
        expect(uploadRes.statusCode).toEqual(201);

        const dbCheck = await request(app).get('/api/users');

        expect(dbCheck.body.length).toEqual(3)

        const searchRes = await request(app)
            .post('/api/users/search')
            .send({ search: 'Grizz' });
        
        expect(searchRes.statusCode).toEqual(200);
        expect(searchRes.body.length).toBeGreaterThan(0);
        expect(searchRes.body[0].username).toContain('Grizz')
    });

    it('Should return an empty array when no users match the search query', async () => {
        await request(app)
            .post('/api/users')
            .send({ username: 'syni', email: 'syni@gmail.com' });

        const res = await request(app)
            .post('/api/users/search')
            .send({ search: 'memeng' });

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(0); 
    });

})