import request from 'supertest';
import app from '../app';
import { clearDatabase } from './utils/db';

describe('Games API Integration test (connected to DB)', () => {
    // before each test, wipe db
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        // close connection
    });

    it('Should add one game to the database', async () => {
        const newGame = { title: 'Lies of P', release_year: 2023}

        const res = await request(app)
            .post('/api/games')
            .send(newGame);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeDefined();

        const dbCheck = await request(app).get('/api/games');

        expect(dbCheck.body.length).toEqual(1);
        expect(dbCheck.body[0].title).toEqual(newGame.title)
    })

    it('Should add multiple games to the database', async () => {
        const newGame = [
            { title: 'Sekiro: Shadows Die Twice', release_year: 2019 },
            { title: 'Hollow Knight: Silksong', release_year: 2025 },
            { title: 'God of War: Ragnarok', release_year: 2022 },
        ];

        const res = await request(app)
            .post('/api/games')
            .send(newGame);

        expect(res.statusCode).toEqual(201);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(3);
        expect(res.body[0].id).toBeDefined();

        const dbCheck = await request(app).get('/api/games');

        expect(dbCheck.body.length).toEqual(3);
    });

    it('Should return 400 Bad Request if title is missing', async () => {
        const newInvalidGame = { release_year: 2024}

        const res = await request(app)
            .post('/api/games')
            .send(newInvalidGame);
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Title is required');

        const dbCheck = await request(app).get('/api/games');
        expect(dbCheck.body.length).toEqual(0);
    })


});