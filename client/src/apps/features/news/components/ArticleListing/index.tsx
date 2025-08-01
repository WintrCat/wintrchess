import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

import { formatDate } from "shared/lib/utils/date";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import ArticleListingProps from "./ArticleListingProps";
import * as styles from "./ArticleListing.module.css";

import iconLogo from "@assets/img/logo.svg";
import iconInterfaceDelete from "@assets/img/interface/delete.svg";
import iconInterfaceEdit from "@assets/img/interface/edit.svg";

function ArticleListing({ article, editable }: ArticleListingProps) {
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const url = useLocation();

    const [ deleteConfirmOpen, setDeleteConfirmOpen ] = useState(false);

    async function deleteArticle() {
        await fetch("/internal/news/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: article.id
            })
        });

        queryClient.refetchQueries({
            queryKey: ["newsArticles"]
        });
    }

    return <div
        className={styles.wrapper}
        onClick={() => {
            if (url.pathname.startsWith("/news")) {
                navigate(`/news/${article.id}`);
            } else {
                location.href = `/news/${article.id}`;
            }
        }}
    >
        <div className={styles.thumbnailContainer}>
            {article.thumbnail
                ? <img
                    className={styles.thumbnail}
                    src={article.thumbnail}
                />
                : <img
                    src={iconLogo}
                    style={{
                        width: "25%",
                        filter: "brightness(0.3)"
                    }}
                />
            }
        </div>

        <span className={styles.articleTitle}>
            {article.title}
        </span>

        <span className={styles.date}>
            {formatDate(new Date(article.timestamp))}
        </span>

        <span
            className={styles.tag}
            style={{
                backgroundColor: `${article.tag.colour}4c`,
                borderColor: `${article.tag.colour}ab`
            }}
        >
            {article.tag.name}
        </span>

        {editable && <div className={styles.toolbar}>
            <Button
                icon={iconInterfaceDelete}
                onClick={event => {
                    event.stopPropagation();
                    setDeleteConfirmOpen(true);
                }}
            />

            <Button
                icon={iconInterfaceEdit}
                onClick={event => {
                    event.stopPropagation();
                    navigate(`/internal/dashboard/news/edit?id=${article.id}`);
                }}
            />
        </div>}

        {deleteConfirmOpen && <ConfirmDialog
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={deleteArticle}
            dangerAction
        >
            Are you sure you want to delete this news post?
        </ConfirmDialog>}
    </div>;
}

export default ArticleListing;