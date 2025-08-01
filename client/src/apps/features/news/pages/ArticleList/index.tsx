import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clamp } from "lodash-es";

import ads from "@/constants/advertisements";
import { useNewsArticles } from "@/hooks/api/useNewsArticles";
import Loader from "@/components/common/Loader";
import Separator from "@/components/common/Separator";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import Advertisement from "@/components/Advertisement";
import BlurredNoiseBackground from "@/components/common/BlurredNoiseBackground";
import SocialLink from "@/apps/features/news/components/SocialLink";
import ArticleListing from "@/apps/features/news/components/ArticleListing";

import * as styles from "./ArticleList.module.css";

import iconNews from "@assets/img/icons/news.png";
import iconYouTube from "@assets/img/connections/youtube.png";
import iconChessCom from "@assets/img/connections/chesscom.png";
import iconBack from "@assets/img/interface/back.svg";
import iconNext from "@assets/img/interface/next.svg";

function News() {
    const { t } = useTranslation("otherPages");

    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ page, setPage ] = useState(1);

    const pageButtonsRef = useRef<HTMLDivElement>(null);

    const {
        articles,
        pageCount,
        articlesStatus
    } = useNewsArticles(page);

    async function switchPage(increment: number) {
        setPage(
            clamp(page + increment, 1, pageCount || Infinity)
        );

        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: page.toString()
        });
    }

    useEffect(() => {
        pageButtonsRef.current?.scrollIntoView();
    }, [page]);

    return <div className={styles.wrapper}>
        <div className={styles.titleSection}>
            <div className={styles.title}>
                <BlurredNoiseBackground
                    width={400}
                    height={67}
                    density={10}
                    colours={[
                        "var(--ui-blue)",
                        "var(--ui-lavender)"
                    ]}
                />

                <img
                    src={iconNews}
                    height={45}
                    style={{ zIndex: 1 }}
                />

                <span style={{
                    fontSize: "2rem",
                    zIndex: 1,
                    overflowWrap: "anywhere"
                }}>
                    {t("news.title")}
                </span>
            </div>

            <div className={styles.titleDescription}>
                {t("news.titleDescription")}
            </div>
        </div>

        <div className={styles.socialsSection}>
            <h2 style={{ margin: 0 }}>
                Socials
            </h2>

            <div className={styles.socialsContainer}>
                <SocialLink
                    icon={iconYouTube}
                    title="WINTR"
                    url="https://www.youtube.com/@wintrchess"
                />

                <SocialLink
                    icon={iconYouTube}
                    title="wintrcat"
                    url="https://www.youtube.com/@wintrcat"
                />

                <SocialLink
                    icon={iconChessCom}
                    iconSize="23px"
                    title="WintrChess Club"
                    url="https://www.chess.com/club/wintrchess/join"
                />
            </div>
        </div>

        <Separator/>

        <Advertisement adUnitId={ads.news.list} style={{
            width: "100%", height: "100px"
        }}/>

        <div className={styles.articles}>
            {articlesStatus == "pending"
                && <Loader style={{ margin: "20px 0" }} />
            }

            {articlesStatus == "success" && articles?.map(
                article => <ArticleListing article={article} />
            )}

            {articlesStatus == "error" && <LogMessage>
                {t("news.error")}
            </LogMessage>}
        </div>

        <div className={styles.pageButtons} ref={pageButtonsRef}>
            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={iconBack}
                onClick={() => switchPage(-1)}
            />

            <span>
                {page} / {pageCount || "..."}
            </span>

            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={iconNext}
                onClick={() => switchPage(1)}
            />
        </div>
    </div>;
}

export default News;