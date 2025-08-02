import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import schemas from "shared/constants/account/schemas";
import { validate } from "shared/lib/utils/validate";
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
import iconSignin from "@assets/img/interface/sign_in.svg";

function SignUp() {
    const { t } = useTranslation(["common", "otherPages"]);

    const navigate = useNavigate();

    const getErrorMessage = useAuthErrors();

    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [ status, setStatus ] = useState<StatusMessage>();

    const [ registrationPending, setRegistrationPending ] = useState(false);

    useAuthErrorReporter(setStatus);

    function googleLogin() {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/analysis",
            errorCallbackURL: "/signup"
        });
    }

    async function register() {
        if (password != confirmedPassword) {
            return setStatus({
                theme: "error",
                message: t("account.errors.passwordNoMatch")
            });
        }

        const registration = {
            email: email,
            name: username,
            password: password
        };

        const error = validate(registration, schemas.registration);

        if (error) return setStatus({
            theme: "error",
            message: getErrorMessage(error)
        });

        setRegistrationPending(true);

        const registerResponse = await authClient.signUp.email(registration, {
            onSuccess: () => setStatus({
                theme: "success",
                message: t("account.verificationMessage")
            })
        });

        if (registerResponse.error) {
            setStatus({
                theme: "error",
                message: getErrorMessage(registerResponse.error.code)
            });

            console.error(
                `failed to sign up: ${JSON.stringify(registerResponse.error)}`
            );
        }

        setRegistrationPending(false);
    }

    return <div className={styles.wrapper}>
        <div className={styles.dialog}>
            <span className={styles.title}>
                {t("signIn.registerTitle", { ns: "otherPages" })}
            </span>

            <Button
                icon={iconGoogle}
                iconSize="28px"
                className={styles.submitButton}
                style={{ gap: "10px" }}
                onClick={googleLogin}
            >
                {t("signIn.registerButtonGoogle", { ns: "otherPages" })}
            </Button>

            <Separator style={{ margin: 0 }}>
                <b>{t("signIn.alternative", { ns: "otherPages" })}</b>
            </Separator>

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.email")}
                onChange={setEmail}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.username")}
                onChange={setUsername}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.password")}
                password
                onChange={setPassword}
            />

            <TextField
                wrapperStyle={{ width: "100%" }}
                className={styles.field}
                placeholder={t("account.placeholders.confirmPassword")}
                password
                onChange={setConfirmedPassword}
            />

            <Button
                icon={iconSignin}
                iconSize="28px"
                className={styles.submitButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                disabled={registrationPending}
                onClick={register}
            >
                {t("signIn.registerButtonEmail", { ns: "otherPages" })}
            </Button>

            {status && <LogMessage theme={status.theme}>
                {status.message}
            </LogMessage>}

            <Separator style={{ margin: 0 }} />

            <Button className={styles.switchFlowButton} onClick={
                () => navigate("/signin")
            }>
                {t("signIn.loginPageButton", { ns: "otherPages" })}
            </Button>

            <span className={styles.legalMessage}>
                {t("signIn.legalMessage", { ns: "otherPages" })}
            </span>
        </div>
    </div>;
}

export default SignUp;