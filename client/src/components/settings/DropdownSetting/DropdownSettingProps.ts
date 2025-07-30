import { CSSProperties, ReactNode } from "react";

import BaseDropdownOption from "./BaseDropdownOption";

interface WidthConstraint {
    width?: string;
}

interface DropdownSettingProps<Option extends BaseDropdownOption> {
    options: Option[];
    defaultValue?: Option;
    onSelect?: (value?: Option) => void;
    searchable?: boolean;

    dropdownStyle?: CSSProperties & WidthConstraint;
    dropdownClassName?: string;

    dropdownLabelStyle?: CSSProperties;
    dropdownLabelClassName?: string;
    dropdownLabelRenderer?: (value: Option) => ReactNode;

    dropdownArrowStyle?: CSSProperties;
    dropdownArrowClassName?: string;

    menuAlignment?: "left" | "center" | "right";
    menuStyle?: CSSProperties & WidthConstraint;
    menuClassName?: string;
    menuPositionStrategy?: "absolute" | "fixed";

    optionStyle?: CSSProperties;
    optionClassName?: string;
}

export default DropdownSettingProps;