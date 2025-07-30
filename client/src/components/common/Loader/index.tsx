import React from "react";

import LoaderProps from "./LoaderProps";
import * as styles from "./Loader.module.css";

function Loader({ size, colour, spinTime, style }: LoaderProps) {
    return <div 
        className={styles.loader}
        style={{
            width: size,
            height: size,
            borderBottomColor: colour,
            animationDuration: spinTime,
            ...style
        }}
    />;
}

export default Loader;