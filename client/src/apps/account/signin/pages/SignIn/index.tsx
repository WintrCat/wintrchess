import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import useAuthErrors from "@/hooks/auth/useAuthErrors";
import useAuthErrorReporter from "../../hooks/useAuthErrorReporter";
import Separator from "@/components/common/Separator";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import ButtonColour from "@/components/common/Button/Colour";
import LogMessage from "@/components/common/LogMessage";
import StatusMessage from "@/components/common/LogMessage/StatusMessage";
import authClient from "@/lib/auth";

import * as styles from "../../index.module.css";

import iconGoogle from "@assets/img/connections/google.png";
import iconSignIn from "@assets/img/interface/sign_in.svg";

function SignIn() {
    const { t } = useTranslation(["otherPages", "common"]);

    const navigate = useNavigate();

    const getErrorMessage = useAuthErrors();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    useAuthErrorReporter(setStatus);

    async function googleLogin() {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/analysis",
            errorCallbackURL: "/signin"
        });
    }

    async function login() {
        const loginResponse = await authClient.signIn.email({
            email, password,
            callbackURL: "/analysis"
        });

        if (loginResponse.error) setStatus({
            theme: "error",
            message: getErrorMessage(loginResponse.error.code)
        });
    }

    return <div className={styles.wrapper}>
        <div className={styles.dialog}>
            <span className={styles.title}>
                {t("signIn.loginTitle")}
            </span>

            <Button
                icon={iconGoogle}
                iconSize="28px"
                className={styles.submitButton}
                style={{ gap: "10px" }}
                onClick={googleLogin}
            >
                {t("signIn.loginButtonGoogle")}
            </Button>

            <Separator style={{ margin: 0 }}>
                <b>{t("signIn.alternative")}</b>
            </Separator>

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.email", { ns: "common" })}
                onChange={setEmail}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.password", { ns: "common" })}
                password
                onChange={setPassword}
            />

            <Button
                icon={iconSignIn}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                onClick={login}
            >
                {t("signIn.loginButtonEmail")}
            </Button>

            {status && <LogMessage theme={status.theme}>
                {status.message}
            </LogMessage>}

            <Separator style={{ margin: 0 }} />

            <Button className={styles.switchFlowButton} onClick={
                () => navigate("/signup")
            }>
                {t("signIn.registerPageButton")}
            </Button>

            <span className={styles.legalMessage}>
                {t("signIn.legalMessage")}
            </span>
        </div>
    </div>;
}

export default SignIn;