import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuthedProfile } from "@/hooks/api/useProfile";
import Separator from "@/components/common/Separator";

import EditProfile from "./EditProfile";
import ManageAccount from "./ManageAccount";
import * as categoryStyles from "../Category.module.css";

function Account() {
    const { t } = useTranslation("settings");

    const navigate = useNavigate();

    const { status } = useAuthedProfile();

    useEffect(() => {
        if (status == "error") navigate("/settings");
    }, [status]);

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t("account.editProfile.title")}
        </b>

        <Separator className={categoryStyles.separator} />

        <EditProfile/>

        <b className={categoryStyles.header}>
            {t("account.manageAccount.title")}
        </b>

        <Separator className={categoryStyles.separator} />

        <ManageAccount/>
    </div>;
}

export default Account;