import React from "react";

import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";

import * as styles from "./Unfound.module.css";

import iconUnfoundgame from "@assets/img/unfoundgame.gif";
import iconInterfaceBack from "@assets/img/interface/back.svg";

function Unfound() {
    return <div className={styles.wrapper}>
        <h1 className={styles.errorCode}>404</h1>
        <span>Looks like you're lost.</span>

        <img
            className={styles.image}
            src={iconUnfoundgame}
        />

        <a href="/">
            <Button
                icon={iconInterfaceBack}
                iconSize="30px"
                style={{
                    backgroundColor: ButtonColour.BLUE,
                    padding: "5px 10px"
                }}
            >
                Return Home
            </Button>
        </a>
    </div>;
}

export default Unfound;