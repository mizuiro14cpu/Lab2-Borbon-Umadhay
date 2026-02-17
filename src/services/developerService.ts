import { supabase } from '../supabaseClient';

export type Developer = {
    id?: number;
    name: string;
};

export const getDevelopers = async (): Promise<Developer[]> => {
    const { data, error } = await supabase
        .from('developers')
        .select('*');

    if (error) throw new Error(error.message);

    return data as Developer[];
};

export const createDeveloper = async (name: string): Promise<Developer> => {
    const { data, error } = await supabase
        .from('developers')
        .insert([{ name }])
        .select();

    if (error) throw new Error(error.message);

    return (data as Developer[])[0];
};

export const updateDeveloper = async (id: number, name: string): Promise<Developer> => {
    const { data, error } = await supabase
        .from('developers')
        .update({ name })
        .eq('id', id)
        .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Developer not found');

    return (data as Developer[])[0];
};

export const deleteDeveloper = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('developers')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
};

export default {
    getDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
};
