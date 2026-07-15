export interface ThemePreset {

    id: string;

    name: string;

    workflow: string;

    positive: string;

    negative: string;

    sampler: string;

    scheduler: string;

    cfg: number;

    steps: number;

    width: number;

    height: number;

    randomSeed: boolean;

    outputPrefix: string;

}