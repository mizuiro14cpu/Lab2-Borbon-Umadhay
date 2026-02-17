import request from 'supertest';
import app from '../app';
import { clearDatabase } from './utils/db';

describe('Developers API Integration test (connected to DB)', () => {
    jest.setTimeout(15000);

    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
    });

    it('should insert a new developer into the database', async () => {
        const newDev = { name: 'Borbs' };

        const res = await request(app)
            .post('/api/developers')
            .send(newDev);

        expect(res.statusCode).toEqual(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(newDev.name);

        // verify it was persisted
        const dbCheck = await request(app).get('/api/developers');
        expect(dbCheck.body.length).toEqual(1);
        expect(dbCheck.body[0].name).toEqual(newDev.name);
    });

    it('should update an existing developer in the database', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/developers')
            .send({ name: 'OldName' });

        const devId = createRes.body.id;

        // update
        const updateRes = await request(app)
            .put(`/api/developers/${devId}`)
            .send({ name: 'NewName' });

        expect(updateRes.statusCode).toEqual(200);
        expect(updateRes.body.name).toEqual('NewName');

        // verify the update persisted
        const dbCheck = await request(app).get('/api/developers');
        expect(dbCheck.body.length).toEqual(1);
        expect(dbCheck.body[0].name).toEqual('NewName');
    });

    it('should delete a developer from the database', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/developers')
            .send({ name: 'ToDelete' });

        const devId = createRes.body.id;

        // delete
        const deleteRes = await request(app)
            .delete(`/api/developers/${devId}`);

        expect(deleteRes.statusCode).toEqual(204);

        // verify it was removed
        const dbCheck = await request(app).get('/api/developers');
        expect(dbCheck.body.length).toEqual(0);
    });

    // Sad paths

    it('should return 400 when inserting a developer without a name', async () => {
        const res = await request(app)
            .post('/api/developers')
            .send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Name is required');
    });

    it('should return 400 when updating a developer without a name', async () => {
        // insert first
        const createRes = await request(app)
            .post('/api/developers')
            .send({ name: 'ValidDev' });

        const devId = createRes.body.id;

        // update with empty body
        const updateRes = await request(app)
            .put(`/api/developers/${devId}`)
            .send({});

        expect(updateRes.statusCode).toEqual(400);
        expect(updateRes.body.error).toEqual('Name is required');
    });
});
