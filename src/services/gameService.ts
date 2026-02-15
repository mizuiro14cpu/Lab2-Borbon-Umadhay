import { supabase } from '../supabaseClient';

export type Game = {
    id?: number;
    title: string;
    release_year?: number;
};

export const getGames = async (): Promise<Game[]> => {
    const { data, error } = await supabase
        .from('games')
        .select('*');

    if (error) throw new Error(error.message);

    return data as Game[];
};

// export const createGame = async (title: string, release_year?: number): Promise<Game> => {
//     const payload: any = { title };
//     if (release_year !== undefined) payload.release_year = release_year;

//     const { data, error } = await supabase
//         .from('games')
//         .insert([payload])
//         .select();

//     if (error) throw new Error(error.message);

//     return (data as Game[])[0];
// };

export const createGame = async (games: Game | Game[]): Promise<Game[]> => {
    const payload = Array.isArray(games) ? games : [games];

    const { data, error } = await supabase
        .from('games')
        .insert(payload)
        .select();
    
    if (error) throw new Error(error.message);

    return data as Game[]
}

export default {
    getGames,
    createGame,
};
