import request from 'supertest';
import app from '../app';

import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Genre API (Supabase)', () => {

    it('should fetch all genres from the database', async () => {

        const mockData = [{ id: 1, name: 'Action' }, { id: 2, name: 'RPG' }];

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        });

        const res = await request(app).get('/api/genres');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockData);
    });

    it('should add a new genre', async () => {
        const newGenre = { name: 'Horror' };
        const mockResponse = [{ id: 3, ...newGenre }];

        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
        });

        const res = await request(app).post('/api/genres').send(newGenre);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockResponse[0]);
    });

    it('should return 400 if name is missing', async () => {
        const res = await request(app).post('/api/genres').send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Name is required');
    });

    it('should handle Supabase errors gracefully on GET', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database connection failed' },
            }),
        });

        const res = await request(app).get('/api/genres');

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toEqual('Database connection failed');
    });

    it('should handle Supabase errors gracefully on POST', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Insert failed' },
            }),
        });

        const res = await request(app).post('/api/genres').send({ name: 'Puzzle' });

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toEqual('Insert failed');
    });

});