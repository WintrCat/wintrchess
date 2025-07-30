import React, { useMemo } from "react";
import { range, random, round, sample } from "lodash-es";

import BlurredNoiseBackgroundProps from "./BlurredNoiseBackgroundProps";
import * as styles from "./BlurredNoiseBackground.module.css";

function BlurredNoiseBackground({
    width,
    height,
    density,
    colours
}: BlurredNoiseBackgroundProps) {
    const shapes = useMemo(() => range(density)
        .map(() => {
            const shapeSize = random(10, round(width * 0.2));

            return <div
                className={styles.blurredShape}
                style={{
                    top: random(-shapeSize, height),
                    left: random(-shapeSize, width),
                    width: shapeSize,
                    height: shapeSize,
                    backgroundColor: (
                        sample(colours || [])
                        || "var(--ui-blue)"
                    )
                }}
            />;
        }), []
    );

    return <>{shapes}</>;
}

export default BlurredNoiseBackground;