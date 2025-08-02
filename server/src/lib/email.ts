import { readFileSync } from "fs";
import mailer from "nodemailer";

interface AccountEmailOptions {
    recipient: string;
    subject: string;
    message: string;
    buttonLabel: string;
    buttonUrl: string;
    plaintextFallback?: string;
}

const accountEmailTemplate = readFileSync(
    "server/src/resources/account.html", "utf-8"
);

export async function sendAccountEmail(options: AccountEmailOptions) {
    if (!process.env.ORIGIN || !process.env.EMAIL_ACCOUNT) {
        throw new Error("origin or email account variable missing.");
    }

    const transporter = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.AUTOMATED_EMAIL_KEY
        }
    });

    await transporter.sendMail({
        from: `"WintrChess No-Reply" <${process.env.AUTOMATED_EMAIL_ADDRESS}>`,
        to: options.recipient,
        subject: options.subject,
        text: options.plaintextFallback,
        html: accountEmailTemplate
            .replace(/\${SUBJECT}/gi, options.subject)
            .replace(/\${ORIGIN}/gi, process.env.ORIGIN)
            .replace(/\${MESSAGE}/gi, options.message)
            .replace(/\${VERIFICATION_URL}/gi, options.buttonUrl)
            .replace(/\${BUTTON_LABEL}/gi, options.buttonLabel)
            .replace(/\${EMAIL_ACCOUNT}/gi, process.env.EMAIL_ACCOUNT)
            .replace(
                /\${COPYRIGHT_YEAR}/gi,
                new Date().getFullYear().toString()
            )
    });
}