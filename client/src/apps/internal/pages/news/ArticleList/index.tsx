import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clamp } from "lodash-es";

import { useNewsArticles } from "@/hooks/api/useNewsArticles";
import Loader from "@/components/common/Loader";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import ArticleListing from "@/apps/features/news/components/ArticleListing";
import LogMessage from "@/components/common/LogMessage";

import * as styles from "./ArticleList.module.css";

import iconInterfaceAdd from "@assets/img/interface/add.svg";
import iconInterfaceBack from "@assets/img/interface/back.svg";
import iconInterfaceNext from "@assets/img/interface/next.svg";

function ArticleList() {
    const { t } = useTranslation("otherPages");

    const navigate = useNavigate();

    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ page, setPage ] = useState(1);

    const pageButtonsRef = useRef<HTMLDivElement>(null);

    const { articles, pageCount, articlesStatus } = useNewsArticles(page);

    useEffect(() => {
        pageButtonsRef.current?.scrollIntoView();
    }, [page]);

    async function switchPage(increment: number) {
        setPage(
            clamp(page + increment, 1, pageCount || Infinity)
        );

        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: page.toString()
        });
    }

    return <div className={styles.wrapper}>
        <Button
            icon={iconInterfaceAdd}
            style={{
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={() => navigate("/internal/dashboard/news/edit")}
        >
            Compose News Post
        </Button>

        <div className={styles.articles}>
            {articlesStatus == "pending"
                && <Loader style={{ margin: "20px 0" }} />
            }

            {articlesStatus == "success" && articles?.map(article => (
                <ArticleListing article={article} editable/>
            ))}

            {articlesStatus == "error" && <LogMessage>
                {t("news.error")}
            </LogMessage>}
        </div>

        <div className={styles.pageButtons} ref={pageButtonsRef}>
            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={iconInterfaceBack}
                onClick={() => switchPage(-1)}
            />

            <span>
                {page} / {pageCount || "..."}
            </span>

            <Button
                style={{
                    backgroundColor: ButtonColour.BLUE
                }}
                icon={iconInterfaceNext}
                onClick={() => switchPage(1)}
            />
        </div>
    </div>;
}

export default ArticleList;