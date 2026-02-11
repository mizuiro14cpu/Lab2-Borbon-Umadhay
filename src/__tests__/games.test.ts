import request from 'supertest';
import app from '../app';

import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
    },
}))

describe('Games API (Supabase)', () => {

    it('should fetch all games from the database (data has no owner and dev id)', async () => {
        // define fake data
        const mockData = [{ id: 1, title: 'Hollow Knight: Silkong', release_year: 2025}];

        // mock chain: supabase.from().select()
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        })

        // run
        const res = await request(app).get('/api/games');

        // assertions
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockData);
    });

    it('should add a new game', async () => {
        const newGame = { title: 'Hytale', release_year: 2026};
        const mockResponse = [{ id: 2, ...newGame }];

        // mock chain: supabase.from().insert().select()
        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
        });

        const res = await request(app).post('/api/games').send(newGame);

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

        const res = await request(app).get('/api/games');

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toEqual("Database connection failed");
    });
})