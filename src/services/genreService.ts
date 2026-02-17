import { supabase } from '../supabaseClient';

export type Genre = {
    id?: number;
    name: string;
};

export const getGenres = async (): Promise<Genre[]> => {
    const { data, error } = await supabase
        .from('genres')
        .select('*');

    if (error) throw new Error(error.message);

    return data as Genre[];
};

export const createGenre = async (name: string): Promise<Genre> => {
    const { data, error } = await supabase
        .from('genres')
        .insert([{ name }])
        .select();

    if (error) throw new Error(error.message);

    return (data as Genre[])[0];
};

export const updateGenre = async (id: number, name: string): Promise<Genre> => {
    const { data, error } = await supabase
        .from('genres')
        .update({ name })
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Genre not found');

    return (data as Genre[])[0];
};

export const deleteGenre = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('genres')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
};

export default {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
};
