import React, { useState } from "react";
import Switch from "react-switch";

import SwitchSettingProps from "./SwitchSettingProps";

function SwitchSetting({
    defaultChecked,
    disabled,
    onChange
}: SwitchSettingProps) {
    const [ checked, setChecked ] = useState(defaultChecked);

    return <Switch
        checked={checked}
        onChange={newChecked => {
            setChecked(newChecked);
            onChange(newChecked);
        }}
        height={25}
        onColor="#467de8"
        offColor="#2c2f35"
        uncheckedIcon={false}
        checkedIcon={false}
        disabled={disabled}
    />;
}

export default SwitchSetting;