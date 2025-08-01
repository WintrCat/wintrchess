import { useQuery } from "@tanstack/react-query";
import { NewsArticle, NewsArticleMetadata } from "shared/types/NewsArticle";

export function useNewsArticles(page = 1) {
    const {
        data: articles,
        status: articlesStatus,
        refetch: refetchArticles
    } = useQuery({
        queryKey: ["newsArticles", page],
        queryFn: async () => {
            const response = await fetch(`/api/public/news?page=${page}`);
            if (!response.ok) throw new Error();

            const articles: NewsArticleMetadata[] = await response.json();
            
            return articles;
        },
        refetchOnWindowFocus: false
    });

    const {
        data: pageCount,
        status: pageCountStatus,
        refetch: refetchPageCount
    } = useQuery({
        queryKey: ["newsArticlesPages"],
        queryFn: async () => {
            const response = await fetch("/api/public/news/pages");
            if (!response.ok) throw new Error();
            
            const pageCount: number = await response.json();

            return pageCount;
        },
        refetchOnWindowFocus: false
    });

    async function refetch() {
        await refetchArticles();
        await refetchPageCount();
    }

    return {
        articles,
        pageCount,
        articlesStatus,
        pageCountStatus,
        refetch
    };
}

export function useNewsArticle(id: string) {
    const { data: article, status, refetch } = useQuery({
        queryKey: ["newsArticle", id],
        queryFn: async () => {
            const response = await fetch(`/api/public/news?id=${id}`);
            if (!response.ok) throw new Error();

            const article: NewsArticle = await response.json();
            
            return article;
        }
    });

    return { article, status, refetch };
}