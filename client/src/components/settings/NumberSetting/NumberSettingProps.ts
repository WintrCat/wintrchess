import { CSSProperties } from "react";

interface NumberSettingProps {
    defaultValue?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    style?: CSSProperties;
}

export default NumberSettingProps;