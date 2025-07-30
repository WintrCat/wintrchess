import { useTranslation } from "react-i18next";

import accountErrors from "shared/constants/account/errors";

function useAuthErrors() {
    const { t } = useTranslation("common");

    return (errorCode?: string) => {
        if (!errorCode) return t("unknownError");

        const error = Object.values(accountErrors).find(
            error => error.code == errorCode
        );
        
        return t(error?.message || "unknownError");
    };
}

export default useAuthErrors;