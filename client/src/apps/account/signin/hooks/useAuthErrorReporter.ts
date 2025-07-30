import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import accountErrors from "shared/constants/account/errors";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";

function useAuthErrorReporter(
    onStatusMessage: (statusMessage: StatusMessage) => void
) {
    const { t } = useTranslation("common");

    const [ searchParams ] = useSearchParams();

    useEffect(() => {
        // Attempting to login to social when email already exists
        if (searchParams.get("error") != "account_not_linked") return;

        onStatusMessage({
            theme: "error",
            message: t(accountErrors.EMAIL_TAKEN.message)
        });
    }, []);
}

export default useAuthErrorReporter;