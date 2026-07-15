import { ThemePreset } from "./types";

const cyberpunk: ThemePreset = {

    id: "cyberpunk",

    name: "Cyberpunk",

    workflow: "cyberpunk",

    positive: `
portrait of a confident person,
futuristic black leather jacket,
green and red neon city,
volumetric lighting,
masterpiece,
ultra realistic,
8k,
cinematic,
professional photography
`,

    negative: `
low quality,
worst quality,
blurry,
extra fingers,
extra limbs,
bad anatomy,
watermark,
text,
logo
`,

    sampler: "euler",

    scheduler: "normal",

    cfg: 4,

    steps: 25,

    width: 768,

    height: 1152,

    randomSeed: true,

    outputPrefix: "cyberpunk"

};

export default cyberpunk;
