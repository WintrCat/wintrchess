interface SwitchSettingProps {
    defaultChecked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}

export default SwitchSettingProps;