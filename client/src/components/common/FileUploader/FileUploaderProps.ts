import { CSSProperties, ReactNode } from "react";

interface FileUploaderProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    extensions?: string[];
    onFilesUpload?: (files: FileList) => void;
}

export default FileUploaderProps;