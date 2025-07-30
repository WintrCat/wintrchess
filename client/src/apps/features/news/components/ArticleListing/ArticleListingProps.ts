import NewsArticle from "shared/types/NewsArticle";

interface ArticleListingProps {
    article: NewsArticle;
    editable?: boolean;
    hardReload?: boolean;
}

export default ArticleListingProps;