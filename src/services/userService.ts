import { supabase } from '../supabaseClient';

export type User = {
    id?: number;
    username: string;
    email: string;
};

export const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data as User[];
};

export const searchUser = async (query: string): Promise<User[]> => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("name", `%${query}%`);
    
    if (error) throw new Error(error.message);
    return data || []
};

export const createUser = async (username: string, email: string): Promise<User> => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, email }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return (data as User[])[0];
};

export default {
    getUsers,
    createUser,
    searchUser
};
