import openings from "@/resources/openings.json" with { type: "json" };

export function getOpeningName(fen: string) {
    const openingsDatabase = openings as Record<string, string>;
    const fenPieces = fen.split(" ").at(0);

    if (!fenPieces) return undefined;

    return openingsDatabase[fenPieces];
}