import React, { useEffect } from "react";

import AdvertisementProps from "./AdvertisementProps";
import * as styles from "./Advertisement.module.css";

function Advertisement({
    className,
    style,
    publisherId,
    adUnitId
}: AdvertisementProps) {
    useEffect(() => {
        try {
            window.adsbygoogle ??= [];
            window.adsbygoogle.push({});
        } catch {
            console.warn("advertisement duplicate load cancelled.");
        }
    }, []);

    const pubId = publisherId || process.env.ADS_PUBLISHER_ID;
    if (!pubId) return null;

    const devClassName = process.env.NODE_ENV == "development"
        ? styles.dev : "";

    return <ins
        className={`adsbygoogle ${className} ${devClassName}`}
        style={{ display: "block", ...style }}
        data-ad-client={pubId}
        data-ad-slot={adUnitId}
    />;
}

export default Advertisement;