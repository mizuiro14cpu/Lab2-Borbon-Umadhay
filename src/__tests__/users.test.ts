import request from 'supertest';
import app from '../app';

// import real client
import { supabase } from '../supabaseClient';

// jest to mock the module
jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Users API (Supabase)', () => {

    it('should fetch all users from the database', async () => {
        // define fake data
        const mockData = [{ id: 1, username: 'memeng-04', email: 'memeng@gmail.com'}];

        // mock chain: supabase.from().select()
        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        })

        // run
        const res = await request(app).get('/api/users');

        // assertions
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockData);
    });

    it('should add a new user', async () => {
        const newUser = { username: 'mizuiro', email: 'mizuiro@gmail.com'};
        const mockResponse = [{ id: 2, ...newUser }];

        // mock chain: supabase.from().insert().select()
        (supabase.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
        });

        const res = await request(app).post('/api/users').send(newUser);

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

        const res = await request(app).get('/api/users');

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toEqual("Database connection failed");
    });

    // it('should search for users after adding users to the db', async () => {
    //     const usersData = [
    //         { id: 1, username: 'DeafMuteDeezNuts', email: 'dmdn@gmail.com' }, 
    //         { id: 2, username: 'bcbach190', email: 'bcbach@gmail.com' }, 
    //         { id: 3, username: 'borgar_69', email: 'borgar@gmail.com' }];

    //     const searchInput = [{ username: 'bcbach190'}]
    //     const mockResponse = [{ id: 2, username: 'bcbach190', email: 'bcbach@gmail.com' }];

    //     (supabase.from as jest.Mock).mockReturnValue({
    //         insert: jest.fn().mockReturnThis(),
    //         select: jest.fn().mockResolvedValue({ data: mockResponse, error: null })
    //     })

    //     const res = await request(app).post('/api/users').send(usersData).get('/api);

    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body).toEqual(mockResponse);
    // })
});