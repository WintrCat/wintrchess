import { useTranslation } from "react-i18next";
import { solveChallenge } from "altcha-lib";
import { Challenge } from "altcha-lib/types";

import useAnalysisSessionStore from "@analysis/stores/AnalysisSessionStore";

export function useAltcha() {
    const { t } = useTranslation("analysis");

    const {
        setAnalysisSessionToken,
        setAnalysisCaptchaError
    } = useAnalysisSessionStore();

    async function execute() {
        const challengeResponse = await fetch("/auth/captcha");

        if (!challengeResponse.ok)
            return setAnalysisCaptchaError(
                t("progressReporter.captchaUnknownError")
            );

        const challengeData: Challenge = await challengeResponse.json();

        const solution = await solveChallenge(
            challengeData.challenge,
            challengeData.salt,
            challengeData.algorithm,
            challengeData.maxnumber
        ).promise;

        if (!solution) return setAnalysisCaptchaError(
            t("progressReporter.captchaVerifyFailed")
        );

        const sessionResponse = await fetch("/auth/analysis-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                algorithm: challengeData.algorithm,
                challenge: challengeData.challenge,
                number: solution.number,
                salt: challengeData.salt,
                signature: challengeData.signature,
                took: solution.took
            })
        });

        if (!sessionResponse.ok)
            return setAnalysisCaptchaError(
                t("progressReporter.captchaVerifyFailed")
            );

        const sessionToken = await sessionResponse.text();

        setAnalysisSessionToken(sessionToken);
        setAnalysisCaptchaError();
    }

    return execute;
}