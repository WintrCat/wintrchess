interface ColourSwatchProps {
    colour?: string;
    onColourChange?: (colour: string) => void;
    open?: boolean;
    onToggle?: (open: boolean) => void;
}

export default ColourSwatchProps;