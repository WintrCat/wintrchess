import React from "react";

import Separator from "@/components/common/Separator";
import { manageDataConsent } from "@/lib/consent";

import * as styles from "../../index.module.css";

import iconLogo from "@assets/img/logo.svg";

function PrivacyPolicy() {
    return <div className={styles.wrapper}>
        <div className={styles.content}>
            <h1 className={styles.title}>
                <img
                    src={iconLogo}
                    height={45}
                    draggable={false}
                />

                Privacy Policy
            </h1>

            <Separator/>

            <h2 style={{ margin: 0 }}>
                1. Glossary
            </h2>

            <span>
                1.1 "The Service", "The Website", "We", "Our", "Us" - the wintrchess.com website
                and any service that we provide that you use therein.
                Also the entity that collects information from you.
            </span>

            <span>
                1.2 "The User", "You", "Your" - The entity from whom we are collecting and or processing information.
            </span>

            <h2 style={{ margin: 0 }}>
                Data we collect
            </h2>

            <h3 style={{ margin: 0 }}>
                2. General
            </h3>

            <span>
                2.1 IP Addresses are collected to establish a connection between
                the User and the Website. In order to uphold security practices, we may
                also collect the following information from you when you visit the Website:

                <ul>
                    <li>Information about your web browser</li>
                    <li>Information about your device</li>
                    <li>Website usage data</li>
                </ul>

                2.2 For more information on what data we collect in this regard,
                you can refer to the{" "}

                <a href="https://www.cloudflare.com/en-gb/privacypolicy/">
                    Cloudflare, Inc. Privacy Policy
                </a>

                , since we use Cloudflare as a security service. Cloudflare is based in the
                United States, so by using the Website you agree to have your data processed
                in this country.
            </span>

            <span>
                2.3 We use local storage to save information across different sessions, including:

                <ul>
                    <li>
                        The settings you chose on the settings page, excluding account settings,
                        the information for which is retained on the server.
                    </li>

                    <li>The preferred language that you selected.</li>
                </ul>

                This information is used to improve your experience on the Website, and stays
                on your device.
            </span>

            <h3 style={{ margin: 0 }}>
                3. Game Analysis
            </h3>

            <span>
                3.1 We use cookies to store a session token string. This keeps you from
                needing to solve a CAPTCHA to access Chess game analysis and move
                classifications, but doesn't contain any personally identifying information.
                It is highly recommended to keep cookies on; you may otherwise lose
                functionality. The CAPTCHA is proof-of-work based; it in itself does not
                collect any personal data.
            </span>

            <span>
                3.2 When you analyse a game on the Website, we collect any information that you
                have explicitly provided to us. This includes the PGN (Portable Game Notation)
                file that represents the game that you have chosen to analyse. Depending on the
                PGN file provided, this may include:

                <ul>
                    <li>Player names and ratings</li>
                    <li>Tournament and event information</li>
                    <li>Time control, variant, results and other game metadata</li>
                </ul>

                3.3 We collect PGN files in order to process your analysis request.
                We may sometimes retain PGN files provided for game analysis for longer periods
                of time in order to improve the Website and aid the development of new services.
                If PGN files are retained for this reason, they will be anonymised.
            </span>

            <span>
                3.4 When you search for games on your Chess.com or Lichess account, the username
                that you provided will be collected by those respective services. Chess.com
                and Lichess are based in the United States and France respectively, so by
                searching for games on your account, you agree to having your data processed
                in these countries.
            </span>

            <a href="https://www.chess.com/legal/privacy">
                Chess.com Privacy Policy
            </a>

            <a href="https://lichess.org/privacy">
                Lichess.org Privacy Policy
            </a>

            <span>
                3.5 We use local storage to save particular analysis related information across
                different sessions. This includes:

                <ul>
                    <li>
                        The last game source you selected with the game selector.
                        This may be PGN, Chess.com etc.
                    </li>

                    <li>
                        The last inputs you gave for each game source in the game selector.
                        For example, this may be your username in the "Select game from Chess.com"
                        field, or the last PGN you provided to the "Select game from PGN" field.
                    </li>
                </ul>
            </span>

            <h3 style={{ margin: 0 }}>
                4. Game Archive
            </h3>

            <span>
                4.1 If you have an account on the Website, you can save Chess games that you
                analyse to the{" "}

                <a href="/archive">Game Archive</a>

                . If you do this, we collect information about the Chess game as well as
                any information about the analysis you have conducted, in order to provide
                the archive service. This includes:

                <ul>
                    <li>
                        The PGN (Portable Game Notation) file that represents the game,
                        including any metadata therein as defined by{" "}

                        <b>Section 3.2</b>
                    </li>

                    <li>Evaluations and moves provided by a Chess engine</li>
                    <li>Move classifications that we have provided during analysis</li>
                </ul>

                This information is retained until you delete the game from your archive,
                or delete your account.
            </span>

            <h3 style={{ margin: 0 }}>
                5. Accounts
            </h3>

            <span>
                You, while on the Website, have the option to make an account. You do not have
                to do this, although some services we provide cannot be used without one.
            </span>

            <span>
                When you sign up for an account, we collect the information that you explicitly
                provide to us in order to provide the Website and its services. This includes:

                <ul>
                    <li>Your Email Address</li>
                    <li>The username you provide</li>
                    <li>Your display name, if you sign in with Google</li>
                    <li>Your profile picture, if you sign in with Google</li>
                    <li>Your password in hashed form, if you sign up with credentials</li>
                </ul>

                This information is retained for the duration that you keep your account open on
                the Website.
            </span>

            <h2 style={{ margin: 0 }}>
                6. Data we provide to third parties
            </h2>

            <span>
                6.1 We use Google AdSense on the Website to serve advertisements. Google LLC,
                as a third-party vendor, uses cookies to serve personalised advertising.
                You are prompted to provide explicit consent to this information being
                collected when you first visit the Website, or when you click

                <a className={styles.link} onClick={manageDataConsent}>
                    Privacy Settings
                </a>

                {" "}which is always located in the footer of the page.
            </span>
                
            <span>
                6.2 Through the same prompt, you also have the right to withdraw your consent to
                this collection at any time. You may also read the{" "}

                <a href="https://policies.google.com/privacy">
                    Google LLC Privacy Policy
                </a>

                , should you want to read more about what information is collected in regard to
                serving advertisements on the Website.
            </span>

            <h2 style={{ margin: 0 }}>
                7. Children's Privacy
            </h2>

            <span>
                We do not knowingly collect personal information from persons under the
                age of 13. If you think that we have done so, please contact us.
            </span>

            <h2 style={{ margin: 0 }}>
                8. Your Data Rights
            </h2>

            <span>
                In accordance with the GDPR, you have the right to:
            </span>

            <ul>
                <li>
                    Request for a copy of the personal information we hold about you.
                </li>

                <li>
                    Request for the personal information we hold about you to be erased.
                    You can do this by deleting your account through the{" "}

                    <a href="/settings/account">settings page.</a>
                </li>

                <li>
                    Request for the personal information we hold about you to be rectified,
                    should you find it inaccurate, incomplete or obsolete.
                </li>
            </ul>

            <h2 style={{ margin: 0 }}>
                9. Revisions
            </h2>

            <span>
                Changes to this privacy policy will be announced on the website page.
            </span>

            <span>
                Last revision to this privacy policy: 31st July 2025
            </span>

            <h2 style={{ margin: 0 }}>
                10. Contact Us
            </h2>

            <span>
                If you have questions regarding this policy, or would like to exercise
                your data rights, you can contact us at:
            </span>

            <b>
                {process.env.EMAIL_ACCOUNT}
            </b>
        </div>
    </div>;
}

export default PrivacyPolicy;