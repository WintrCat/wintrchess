interface ConfirmDialogProps {
    children: React.ReactNode;
    dangerAction?: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
}

export default ConfirmDialogProps;