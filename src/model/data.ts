export enum Level {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
}

export type Data = {
    _id: string;
    id: string;
    image: string;
    wordImage: string;
    word: string;
    meaning: string;
    status?: 'approved' | 'rejected';
}

export type MatchCardData = {
    _id?: string;
    id?: string;
    image: string;
    wordImage: string;
    word: string;
    meaning: string;
    level: Level;
}
