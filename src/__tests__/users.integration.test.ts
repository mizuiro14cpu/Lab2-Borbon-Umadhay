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
})