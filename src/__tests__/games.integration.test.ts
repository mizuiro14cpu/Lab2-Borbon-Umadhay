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
    })

    
})