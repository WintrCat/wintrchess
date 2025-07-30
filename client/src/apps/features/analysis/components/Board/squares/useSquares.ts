import { useState } from "react";
import { Square } from "react-chessboard/dist/chessboard/types";
import { Chess } from "chess.js";

export function useSquares() {
    const [ selected, setSelected ] = useState<Square>();
    const [ highlighted, setHighlighted ] = useState<Square[]>([]);
    const [ playable, setPlayable ] = useState<Square[]>([]);
    const [ capturable, setCapturable ] = useState<Square[]>([]);
    const [ pieceDropFlag, setPieceDropFlag ] = useState(false);

    function toggleHighlight(selected: Square) {
        if (highlighted.includes(selected)) {
            setHighlighted(
                highlighted.filter(square => square != selected)
            );
        } else {
            setHighlighted([ ...highlighted, selected ]);
        }
    }

    function loadPlayable(position: string, from: Square) {
        const moves = new Chess(position).moves({
            square: from, verbose: true
        });

        setPlayable(moves
            .filter(move => !move.captured)
            .map(move => move.to)
        );

        setCapturable(moves
            .filter(move => move.captured)
            .map(move => move.to)
        );
    }

    function clearPlayable() {
        setPlayable([]);
        setCapturable([]);
    }

    return {
        selected,
        setSelected,
        highlighted,
        setHighlighted,
        playable,
        setPlayable,
        capturable,
        setCapturable,
        pieceDropFlag,
        setPieceDropFlag,
        toggleHighlight,
        loadPlayable,
        clearPlayable
    };
}

export type SquaresController = ReturnType<typeof useSquares>;