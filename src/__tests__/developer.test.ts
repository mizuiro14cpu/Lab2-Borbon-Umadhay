import request from 'supertest';
import app from '../app';

import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Dev API (Supabase)', () => {

    it('should fetch all developers from the database', async () => {

        const mockData = [{ id: 2, name: 'Borbila' }];

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockData, error: null}),
        })

        const res = await request(app).get('/api/developers');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockData);
    });

    it('should add a new Developer', async () => {
        const newDev = { name: 'Borbs' };
        const mockResponse = [{ id: 2, ...newDev }];

        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
        });

        const res = await request(app).post('/api/developers').send(newDev);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockResponse[0]);
    });

    it('should handle Supabase errors gracefully', async () => {
        // simulate db failure
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({
                data: null,
                error: { message: "Database connection failed" }
            }),
        });

        const res = await request(app).get('/api/developers');

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toEqual("Database connection failed");
    });

});