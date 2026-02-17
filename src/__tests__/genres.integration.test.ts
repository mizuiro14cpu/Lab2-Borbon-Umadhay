import request from 'supertest';
import app from '../app';
import { clearDatabase } from './utils/db';

describe('Genres API Integration test (connected to DB)', () => {
    jest.setTimeout(15000);

    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
    });

    it('should insert a new genre into the database', async () => {
        const newGenre = { name: 'Action' };

        const res = await request(app)
            .post('/api/genres')
            .send(newGenre);

        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(newGenre.name);

        // verify it was persisted
        const dbCheck = await request(app).get('/api/genres');
        expect(dbCheck.body.length).toEqual(1);
        expect(dbCheck.body[0].name).toEqual(newGenre.name);
    });

    it('should update an existing genre in the database', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/genres')
            .send({ name: 'OldGenre' });

        const genreId = createRes.body.id;

        // update
        const updateRes = await request(app)
            .put(`/api/genres/${genreId}`)
            .send({ name: 'UpdatedGenre' });

        expect(updateRes.statusCode).toEqual(200);
        expect(updateRes.body.name).toEqual('UpdatedGenre');

        // verify the update persisted
        const dbCheck = await request(app).get('/api/genres');
        expect(dbCheck.body.length).toEqual(1);
        expect(dbCheck.body[0].name).toEqual('UpdatedGenre');
    });

    it('should delete a genre from the database', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/genres')
            .send({ name: 'ToDelete' });

        const genreId = createRes.body.id;

        // delete
        const deleteRes = await request(app)
            .delete(`/api/genres/${genreId}`);

        expect(deleteRes.statusCode).toEqual(204);

        // verify it was removed
        const dbCheck = await request(app).get('/api/genres');
        expect(dbCheck.body.length).toEqual(0);
    });

    // Sad paths

    it('should return 400 when inserting a genre without a name', async () => {
        const res = await request(app)
            .post('/api/genres')
            .send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Name is required');
    });

    it('should return 400 when updating a genre without a name', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/genres')
            .send({ name: 'ValidGenre' });

        const genreId = createRes.body.id;

        // update with empty body
        const updateRes = await request(app)
            .put(`/api/genres/${genreId}`)
            .send({});

        expect(updateRes.statusCode).toEqual(400);
        expect(updateRes.body.error).toEqual('Name is required');
    });
});
