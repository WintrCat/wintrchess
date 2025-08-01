import React from "react";

import Separator from "@/components/common/Separator";

import * as styles from "../../index.module.css";

import iconLogo from "@assets/img/logo.svg";

function Terms() {
    return <div className={styles.wrapper}>
        <div className={styles.content}>
            <h1 className={styles.title}>
                <img
                    src={iconLogo}
                    height={45}
                    draggable={false}
                />

                Terms of Service
            </h1>

            <Separator/>

            <h2 style={{ margin: 0 }}>
                1. Introduction
            </h2>

            <span>
                wintrchess.com ("We", "Us", "Service(s)", "Website") is a website that
                provides analysis on Chess games, as well as other Chess related tools.
                For questions about these terms, you can contact us via the following
                email address:
            </span>

            <b>{process.env.EMAIL_ACCOUNT}</b>

            <span>
                1.1 These terms (the "Terms") constitute a legally binding agreement between
                you, whether that be personally or on behalf of another entity ("You"),
                in regard to your use of our Services. By using the Services, you confirm
                automatically that you have read, understood and agreed to be bound by
                these Terms. If you do not agree to any of these Terms, you are expressly
                prohibited from using any of the Services.
            </span>

            <span>
                1.2 We reserve the right, in our sole discretion, to make updates to these Terms
                from time to time. If changes are made to the Terms, we may notify users
                of such amendments, although you waive any right to receive specific notice
                thereof, given that it is your responsibility to check the Terms for revisions.
                We will provide the date at which the Terms were last revised at the bottom of
                this document.
            </span>

            <span>
                1.3 When amendments are made, your continued use of the Services will be subject
                to the updated Terms; it will be deemed that you have already been made aware
                of and accepted them.
            </span>

            <span>
                1.4 We reserve the right, but not the obligation, to monitor the Services for
                violations of these Terms, as well as to take appropriate legal action against
                those who, in our sole discretion, have violated these Terms or the law.
            </span>

            <h2 style={{ margin: 0 }}>
                2. General Acceptable Use
            </h2>

            <span>
                In short, while using any of the Services, you should not:

                <ul>
                    <li>2.1 Use the Services to engage in or assist others with illegal activity</li>
                    <li>
                        2.2 Use the Services to engage in spam, especially in a manner that negatively
                        impacts our infrastructure and or ability to provide the Services.
                    </li>
                    <li>2.3 Upload content over which you do not have the necessary rights to upload</li>
                    <li>2.4 Upload or distribute malware, or persuade others into doing so</li>
                    <li>2.5 Attempt to disrupt or interfere with our ability to provide the Service</li>
                    <li>
                        2.6 Use scripting or other techniques to collect data from us in a manner
                        that negatively impacts our infrastructure and or ability to provide
                        the Services
                    </li>
                    <li>
                        2.7 Attempt to access any area or information in relation to the Services that
                        you do not have express permission to access
                    </li>
                    <li>
                        2.8 Attempt to defraud us or other users, especially to gain access to sensitive
                        information, like user passwords
                    </li>
                    <li>
                        2.9 Attempt to disparage or defame, in our opinion, us or the Services
                    </li>
                    <li>
                        2.10 Harass or threaten us or other users of the Services.
                    </li>
                    <li>
                        2.11 Copy the software of any of the Services in a manner not expressly permitted by
                        its copyright license.
                    </li>
                </ul>
            </span>

            <h2 style={{ margin: 0 }}>
                3. Interruption or Modification to Services
            </h2>

            <span>
                3.1 We reserve the right to make any modifications, or to remove any part of the Services
                without notice and for any reason or no reason. We are not liable for any changes
                or discontinuations of any part of the Services that may cause loss, damages or
                otherwise inconveniences for you.
            </span>

            <span>
                3.2 We cannot guarantee that the Services will be available at all times. Sometimes, we
                experience hardware or software problems that are not easy to, or not possible to
                anticipate in advance. You agree that we have no liability for loss, damages or otherwise
                inconveniences caused by the absence of the Services.
            </span>

            <span>
                3.3 Nothing in these Terms can be construed as an obligation for us to maintain, correct,
                update, or provide support for the Services in any way.
            </span>

            <h2 style={{ margin: 0 }}>
                4. Account Registration
            </h2>

            <span>
                4.1 If you would like, you can open an account on the Website to gain access to particular
                services. By creating an account, you confirm automatically that the details you have
                provided are correct, up-to-date and complete. You also confirm that you will update
                such information as necessary. You will be responsible for all use of your account,
                including but not limited to keeping your password confidential.
            </span>

            <span>
                4.2 We reserve the right to change the username or display name of any account opened with
                the Website, for any reason or no reason, including but not limited to a breach of these
                Terms. It is at our sole discretion whether usernames or display names are offensive,
                inappropriate or otherwise objectionable.
            </span>

            <span>
                4.3 We also reserve the right to terminate any account on the Website without notice and for
                any reason or no reason, including but not limited to a breach of these Terms. Similarly,
                we reserve the right to deny anyone access to the Services (for example, through blocking
                IP Addresses) without notice and for any reason or no reason.
            </span>

            <span>
                4.4 As explained by <b>Section 2.2</b>, you may not use any part of the account system on the
                Website (or the rest of the Services) to engage in spam, especially through the registration
                of large numbers of accounts that you will not use, for the sole purpose of negatively
                impacting our infrastructure or ability to provide the Services.
            </span>

            <h2 style={{ margin: 0 }}>
                5. User Contributed Content
            </h2>

            <span>
                5.1 You can upload content ("Content") to the Services by analysing a Chess game, storing
                games in your Game Archive, or by using other available tools. By uploading Content to
                the Website, you confirm automatically that you have the necessary rights over such
                Content, and that in no way does it infringe any third-party rights. If you believe that
                content uploaded to the Website has copied your work in a way that constitutes copyright
                infringement, please contact us immediately.
            </span>

            <span>
                5.2 By uploading Content to the Website, you automatically grant us (and confirm that you
                have the necessary rights to grant us) an unrestricted, irrevocable, transferable,
                royalty-free, worldwide right and license to host, use, copy, reproduce, disclose, sell,
                store, and distribute such Content. The Content can be used by us for any purpose, including
                that which is commercial, that which prepares for the creation of derivative works, or that
                which creates sublicenses.
            </span>

            <span>
                5.3 You agree to retain full ownership over Content you upload to the Website. You are solely
                responsible for statements or representations made by such Content, and you agree to exonerate
                us from any and all responsibility and or liability over such content, and to refrain from
                any legal action in regard to such Content.
            </span>

            <span>
                5.4 We reserve the right to delete, restrict access to partially or fully, or disable any
                uploaded Content without notice, for any reason or no reason, including but not limited to
                a breach of these Terms. In order to do this, we exercise the rights granted to us by the
                license (as explained in <b>Section 5.2</b>) over user contributed Content.
            </span>

            <h2 style={{ margin: 0 }}>
                6. Third-party Websites and Content
            </h2>

            <span>
                The Services may contain links to other websites, texts, photographs, videos, music,
                software, or other media that belongs to or originates from third-party sources
                ("Third-Party Content"). We do not check any Third-Party Content for accuracy,
                appropriateness or completeness, and as such, we do not bear any responsibility
                for Third-Party Content that is accessed through the Services, nor does its inclusion
                therein imply any approval or endorsement of such Third-Party Content. If you
                decide to access any third-party Services, you do so entirely at your own risk,
                and without the government of these Terms. Therefore, we are held blameless to any
                harm that may be caused to you in relation to accessing Third-Party Content. 
            </span>

            <span>
                For most users, this relates to advertisements on the Website or sign-in features
                provided by Google.
            </span>

            <h2 style={{ margin: 0 }}>
                7. Privacy
            </h2>

            <span>
                Our{" "}

                <a href="/privacy">Privacy Policy</a>

                {" "}explains what kind of information we may collect from you while you use the
                Services, how we use it, and your choices in relation to data collection.
            </span>

            <h2 style={{ margin: 0 }}>
                8. Limitation of Liability
            </h2>

            <span>
                The Services are provided "as is" without any warranties, express or implied.
                As such, we and our affiliates are not liable for any loss, damages or
                otherwise inconveniences caused by your use or inability to use the Services,
                nor are we liable for any feature of the Services that you find does not work
                as you expected. This includes but is not limited to the loss of data or the
                failure of the Services to operate with any other software or services. Our
                limitation of liability survives even if we have been advised of the
                possibility of any of the aforementioned damages.
            </span>

            <span>
                Regardless of the form of action, and for any cause whatsoever, our liability
                to you will at all times be limited to the amount paid, if any, by you to us. 
            </span>

            <h2 style={{ margin: 0 }}>
                9. Governing Law
            </h2>

            <span>
                These Terms are governed under the law of the United Kingdom, and as such any
                disputes will be heard under the courts thereof, unless mandatory law
                enforces otherwise.
            </span>

            <span>
                Last revision to this Terms of Service: 31st July 2025
            </span>
        </div>
    </div>;
}

export default Terms;