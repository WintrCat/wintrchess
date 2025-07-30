import { Color, WHITE, BLACK } from "chess.js";

export enum PieceColour {
    WHITE = "white",
    BLACK = "black"
}

export function adaptPieceColour(colour: PieceColour): Color;
export function adaptPieceColour(colour: Color): PieceColour;

export function adaptPieceColour(colour: PieceColour | Color) {
    switch (colour) {
        case WHITE:
            return PieceColour.WHITE;
        case BLACK:
            return PieceColour.BLACK;
        case PieceColour.WHITE:
            return WHITE;
        case PieceColour.BLACK:
            return BLACK;
    }
}

export function flipPieceColour(color: Color): Color;
export function flipPieceColour(color: PieceColour): PieceColour;

export function flipPieceColour(colour: PieceColour | Color) {
    switch (colour) {
        case PieceColour.WHITE:
            return PieceColour.BLACK;
        case PieceColour.BLACK:
            return PieceColour.WHITE;
        case WHITE:
            return BLACK;
        case BLACK:
            return WHITE;
    }
}

export default PieceColour;