import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { uniqueId, replace } from "lodash-es";
import { produce } from "immer";

import NewsArticle from "shared/types/NewsArticle";
import Loader from "@/components/common/Loader";
import ButtonColour from "@/components/common/Button/Colour";
import Button from "@/components/common/Button";
import ColourSwatch from "@/components/settings/ColourSwatch";
import TextField from "@/components/common/TextField";
import { getDataURL, FileUploader } from "@/components/common/FileUploader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import * as styles from "./ArticleEditor.module.css";

import iconInterfaceUpload from "@assets/img/interface/upload.svg";
import iconInterfaceEdit from "@assets/img/interface/edit.svg";

type ArticleFormat = "edit" | "preview";

interface UploadedImage {
    id: string;
    url: string;
}

function ArticleEditor() {
    const navigate = useNavigate();
    const [ queryParams ] = useSearchParams();

    // Article details
    const [ article, setArticle ] = useState<NewsArticle>({
        title: "",
        content: "",
        timestamp: new Date().toISOString(),
        tag: {
            name: "Article",
            colour: "#3b3e43"
        }
    });

    const [ tagColourPickerOpen, setTagColourPickerOpen ] = useState(false);
    const [ thumbnailFile, setThumbnailFile ] = useState<File | undefined>();

    const [ images, setImages ] = useState<UploadedImage[]>([]);

    // Edit or preview mode setting
    const [ articleFormat, setArticleFormat ] = useState<ArticleFormat>("edit");

    // Is publish confirmation dialog open
    const [ publishConfirmOpen, setPublishConfirmOpen ] = useState(false);

    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const { status } = useQuery({
        queryKey: ["editedArticle"],
        queryFn: async () => {
            // Get existing article ID from URL
            const articleId = queryParams.get("id");
            if (!articleId) return;

            // Fetch for the article details
            const articleResponse = await fetch(`/api/public/news?id=${articleId}`);

            const article: NewsArticle = await articleResponse.json();
            if (!article) return;

            const uploadedImages: UploadedImage[] = [];

            // Replace data URLs with image IDs
            const imageMatches = article.content.matchAll(/!\[Image\]\((.+)\)/g);

            for (const match of imageMatches) {
                const imageURL = match.at(1);
                if (!imageURL) continue;

                const imageId = uniqueId();

                article.content = article.content.replace(
                    match[0],
                    `{%upload_cache_${imageId}%}`
                );

                uploadedImages.push({
                    id: imageId,
                    url: imageURL
                });
            }

            setImages(uploadedImages);
            setArticle(article);
        },
        refetchOnWindowFocus: false
    });

    async function addImage(file: File) {
        const fileURL = await getDataURL(file);
        if (!fileURL) return;

        const imageId = uniqueId();

        setImages([
            ...images,
            { id: imageId, url: fileURL }
        ]);

        setArticle(produce(article, draft => {
            const leftContent = draft.content.slice(
                0, editorRef.current?.selectionStart
            );

            const rightContent = draft.content.slice(
                editorRef.current?.selectionStart || 0
            );

            draft.content = (
                leftContent
                + `{%upload_${file.name}_${imageId}%}`
                + rightContent
            );

            return draft;
        }));
    }

    async function publishArticle() {
        const tagRegex = /{%upload_.+_(\d+)%}/;

        const bakedArticleContent = replace(
            article.content,
            new RegExp(tagRegex.source, "g"),
            fileTag => {
                const imageId = fileTag.match(tagRegex)?.at(1);
                if (!imageId) return "";

                const imageURL = images.find(img => img.id == imageId)?.url;

                return imageURL ? `![Image](${imageURL})` : "";
            }
        );

        await fetch("/internal/news/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                produce(article, draft => {
                    draft.content = bakedArticleContent;
                    return draft;
                })
            )
        });

        navigate("/internal/dashboard/news");
    }

    return <div
        className={styles.wrapper}
        onClick={() => setTagColourPickerOpen(false)}
    >
        <div className={styles.thumbnailPreview}>
            {article.thumbnail
                ? <img
                    className={styles.thumbnail}
                    src={article.thumbnail}
                />
                : (status != "pending"
                    && <i className={styles.missingThumbnailMessage}>
                        No Thumbnail
                    </i>
                )
            }

            {status == "pending" && <div className={
                `${styles.thumbnail} ${styles.thumbnailLoader}`
            }>
                <Loader/>
            </div>}
        </div>

        <div className={styles.metadata}>
            <TextField
                placeholder="Article title..."
                value={article?.title}
                onChange={title => {
                    setArticle(produce(article, draft => {
                        draft.title = title;
                        return draft;
                    }));
                }}
                style={{ height: "45px" }}
            />

            <div className={styles.tagMetadata}>
                <TextField
                    placeholder="Tag name..."
                    value={article.tag.name}
                    onChange={tagName => setArticle(
                        produce(article, draft => {
                            draft.tag.name = tagName;
                            return draft;
                        })
                    )}
                    style={{ height: "45px" }}
                />

                <ColourSwatch
                    colour={article.tag.colour}
                    onColourChange={tagColour => {
                        setArticle(produce(article, draft => {
                            draft.tag.colour = tagColour;
                            return draft;
                        }));
                    }}
                    open={tagColourPickerOpen}
                    onToggle={setTagColourPickerOpen}
                />
            </div>

            <div className={styles.thumbnailUploader}>
                <FileUploader
                    extensions={[".png", ".jpg", ".jpeg", ".webp"]}
                    onFilesUpload={async files => {
                        const file = files.item(0);
                        if (!file) return;

                        setThumbnailFile(file);

                        const thumbnailURL = await getDataURL(file);
                        if (!thumbnailURL) return;

                        setArticle(produce(article, draft => {
                            draft.thumbnail = thumbnailURL;
                            return draft;
                        }));
                    }}
                >
                    <Button
                        icon={iconInterfaceUpload}
                        iconSize="25px"
                        style={{
                            backgroundColor: "var(--ui-shade-4)"
                        }}
                    >
                        Upload Thumbnail
                    </Button>
                </FileUploader>

                <span style={{ overflowWrap: "anywhere" }}>
                    {thumbnailFile?.name}
                </span>
            </div>

            <i style={{ color: "gray" }}>
                File limit: 10 MB
            </i>
        </div>

        <div className={styles.formatSelector}>
            <Button
                highlighted={articleFormat == "edit"}
                onClick={() => setArticleFormat("edit")}
                style={{
                    backgroundColor: "var(--ui-shade-4)"
                }}
            >
                Edit
            </Button>

            <Button
                highlighted={articleFormat == "preview"}
                onClick={() => setArticleFormat("preview")}
                style={{
                    backgroundColor: "var(--ui-shade-4)"
                }}
            >
                Preview
            </Button>
        </div>

        <div className={styles.editor}>
            {articleFormat == "edit" && <FileUploader
                extensions={[".png", ".jpg", ".jpeg", ".webp"]}
                onFilesUpload={async files => {
                    const file = files.item(0);
                    if (!file) return;

                    addImage(file);
                }}
            >
                <Button
                    icon={iconInterfaceUpload}
                    iconSize="25px"
                    style={{
                        backgroundColor: "var(--ui-shade-4)"
                    }}
                >
                    Add Image
                </Button>
            </FileUploader>}

            {articleFormat == "edit" && <textarea
                ref={editorRef}
                className={styles.editorContent}
                onChange={event => {
                    setArticle(produce(article, draft => {
                        draft.content = event.target.value;
                        return draft;
                    }));
                }}
                value={article.content}
                placeholder={status == "pending"
                    ? "Loading..." : "Markdown..."
                }
            ></textarea>}
            
            {articleFormat == "preview" && <ReactMarkdown
                className={styles.editorContent}
                urlTransform={value => value}
            >
                {article.content}
            </ReactMarkdown>}
        </div>

        <Button
            icon={iconInterfaceEdit}
            style={{
                gap: "5px",
                backgroundColor: ButtonColour.BLUE
            }}
            onClick={() => setPublishConfirmOpen(true)}
        >
            Publish
        </Button>

        {publishConfirmOpen && <ConfirmDialog
            onClose={() => setPublishConfirmOpen(false)}
            onConfirm={publishArticle}
        >
            Are you sure you want to publish this article?
        </ConfirmDialog>}
    </div>;
}

export default ArticleEditor;