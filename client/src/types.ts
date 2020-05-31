export type PollDto = {
    id: string | null;
    name: string;
    description: string;
    options: string[];
    voters: string[];
}