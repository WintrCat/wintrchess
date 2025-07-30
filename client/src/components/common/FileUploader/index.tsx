import React, { useRef } from "react";

import FileUploaderProps from "./FileUploaderProps";

export async function getDataURL(
    file: File
): Promise<string | undefined> {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener("load", () => (
            res(reader.result?.toString())
        ));

        reader.addEventListener("error", () => (
            rej(reader.error?.message)
        ));
    });
}

export function FileUploader({
    children,
    className,
    style,
    extensions,
    onFilesUpload
}: FileUploaderProps) {
    const fileUploadRef = useRef<HTMLInputElement | null>(null);

    return <>
        <div
            className={className}
            style={style}
            onClick={() => fileUploadRef.current?.click()}
        >
            {children}
        </div>

        <input
            ref={fileUploadRef}
            type="file"
            accept={extensions?.join(",")}
            style={{ display: "none" }}
            onChange={async () => {
                if (!fileUploadRef.current?.files) return;

                onFilesUpload?.(fileUploadRef.current.files);

                fileUploadRef.current.value = "";
            }}
        />
    </>;
}

export default FileUploader;