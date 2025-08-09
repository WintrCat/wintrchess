import { CSSProperties, ReactNode } from "react";

type Fields = "input" | "password" | "both";

interface DetailUpdateDialogProps {
    children?: ReactNode;
    buttonStyle?: CSSProperties;
    placeholder?: string;
    fields?: Fields;
    onClose: () => void;
    onConfirm: (input: string) => void | Promise<void>;
    getErrorMessage?: (input: string) => string | undefined;
    buttonDisabled?: (input: string) => boolean;
    buttonDisabledOnError?: boolean;
}

export default DetailUpdateDialogProps;