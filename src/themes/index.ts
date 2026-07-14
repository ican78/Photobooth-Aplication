import cyberpunk from "./cyberpunk";

export const themes = {
    cyberpunk,
};

export function getTheme(name: string) {
    return themes[name as keyof typeof themes] ?? cyberpunk;
}