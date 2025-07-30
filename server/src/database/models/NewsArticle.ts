import { Schema, model } from "mongoose";

import NewsArticle from "shared/types/NewsArticle";
import Collection from "@/constants/Collection";

const newsArticleSchema = new Schema<NewsArticle>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    tag: {
        name: { type: String, required: true },
        colour: { type: String, required: true }
    },
    timestamp: { type: String, required: true },
    content: { type: String, required: true }
});

const NewsArticle = model(
    "newsArticle",
    newsArticleSchema,
    Collection.NEWS_ARTICLES
);

export default NewsArticle;