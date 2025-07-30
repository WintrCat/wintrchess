import {
    CSSProperties,
    Dispatch,
    ReactNode,
    SetStateAction
} from "react";

interface AnnouncementProps {
    children: ReactNode;
    colour?: string;
    style?: CSSProperties;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default AnnouncementProps;