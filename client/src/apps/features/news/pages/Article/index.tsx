import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { formatDate } from "shared/lib/utils/date";
import { useNewsArticle } from "@/hooks/api/useNewsArticles";
import ads from "@/constants/advertisements";
import Loader from "@/components/common/Loader";
import LogMessage from "@/components/common/LogMessage";
import Advertisement from "@/components/Advertisement";

import * as styles from "./Article.module.css";

function Article() {
    const navigate = useNavigate();

    const { t } = useTranslation(["otherPages", "common"]);

    const { articleId } = useParams();

    const { article, status } = useNewsArticle(articleId || "");

    useEffect(() => {
        if (status == "success" && !article) navigate("/404");
    }, [status]);

    return <div className={styles.wrapper}>
        <Advertisement adUnitId={ads.news.article.top} style={{
            width: "min(800px, 100%)", height: "100px"
        }}/>

        <div className={styles.articleContainer}>
            {status == "pending"
                && <div className={styles.articleLoaderContainer}>
                    <Loader/>

                    <span>{t("loading", { ns: "common" })}</span>
                </div>
            }

            {article && <>
                <div className={styles.tag} style={{
                    backgroundColor: `${article.tag.colour}4c`,
                    borderColor: `${article.tag.colour}ab`
                }}>
                    {article.tag.name}
                </div>

                {article.thumbnail && <img src={article.thumbnail} />}

                <span className={styles.title}>
                    {article.title}
                </span>

                <span className={styles.date}>
                    {formatDate(new Date(article.timestamp))}
                </span>

                <hr className={styles.separator} />

                <ReactMarkdown
                    className={styles.content}
                    urlTransform={value => value}
                >
                    {article.content}
                </ReactMarkdown>
            </>}
        </div>

        {status == "error" && <LogMessage>
            {t("news.article.error")}
        </LogMessage>}

        <Advertisement adUnitId={ads.news.article.bottom} style={{
            width: "min(800px, 100%)", height: "100px"
        }}/>
    </div>;
}

export default Article;