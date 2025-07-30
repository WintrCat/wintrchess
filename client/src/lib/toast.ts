import { toast, TypeOptions, Slide } from "react-toastify";

interface ToastOptions {
    message: string;
    theme: TypeOptions;
    autoClose?: number | boolean;
}

/**
 * @description Auto-close time, if given as a number, is in seconds.
 */
function displayToast({
    message,
    theme,
    autoClose = true
}: ToastOptions) {
    toast(message, {
        position: "bottom-left",
        theme: "dark",
        type: theme,
        transition: Slide,
        autoClose: typeof autoClose == "number"
            ? (autoClose * 1000) : (autoClose && 5000),
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        style: { fontFamily: "Noto Sans" }
    });
}

export default displayToast;