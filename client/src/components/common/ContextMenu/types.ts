export interface ContextMenuPosition {
    x: number;
    y: number;
}

export interface ContextMenuOption {
    icon: any;
    label: string;
    onSelect?: () => void;
}