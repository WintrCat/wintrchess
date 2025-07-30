interface BoardColourPresetProps {
    lightSquareColour: string;
    darkSquareColour: string;
    title?: string;
    selected?: boolean;
    onClick?: () => void;
}

export default BoardColourPresetProps;