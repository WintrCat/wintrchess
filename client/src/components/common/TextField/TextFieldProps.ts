import { CSSProperties, MouseEventHandler } from "react";

interface TextFieldProps {
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    className?: string;
    style?: CSSProperties;
    copyClassName?: string;
    copyStyle?: CSSProperties;
    placeholder?: string;
    value?: string;
    multiline?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    copyable?: boolean;
    copyTooltip?: string;
    copyToast?: string;
    password?: boolean;
    onChange?: (value: string) => void;
    onClick?: MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default TextFieldProps;