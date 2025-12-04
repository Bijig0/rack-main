const { log } = require("console");
const fs = require("fs");
const nodemailer = require("nodemailer");
// cosnt {} = require("../public/assets/")
const path = require("path");

const templateBasePath = path.join(
    __dirname,
    "../public/assets/email-templates/"
);

class Email {
    constructor(currentEmailDetails) {
        this.currentEmailDetails = currentEmailDetails;
        this.from = `${process.env["EMAIL_SENDER"]} <${process.env["EMAIL_FROM"]}>`;
    }

    newTransport() {
        const smtpConfig = {
            host: process.env["EMAIL_HOST"],
            port: Number(process.env["EMAIL_PORT"]),
            secure: false,
            auth: {
                user: process.env["EMAIL_USERNAME"],
                pass: process.env["EMAIL_PASSWORD"],
            },
        };
        return nodemailer.createTransport(smtpConfig);
    }

    async send(template, subject, attachment = null) {
        const templatePath = path.join(templateBasePath, `${template}.html`);

        if (!fs.existsSync(templatePath)) {
            console.error(`Template file not found: ${templatePath}`);
            return;
        }
        let html = fs.readFileSync(templatePath, "utf8");
        Object.keys(this.currentEmailDetails).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, "g");
            html = html.replace(regex, this.currentEmailDetails[key]);
        });

        const mailOptions = {
            from: this.from,
            to: this.currentEmailDetails.to,
            subject,
            html,
        };

        if (attachment) {
            mailOptions.attachments = [
                { filename: attachment.name, content: attachment.content },
            ];
        }

        try {
            const info = await this.newTransport().sendMail(mailOptions);
            console.log("Email sent successfully!", info.messageId);
        } catch (error) {
            console.error("Email sending failed:", error.message);
            console.error(error);
        }
    }

    async sendWelcome() {
        await this.send("Welcome", "Welcome to our Family!");
    }

    async sendTest() {
        await this.send("test", "This email is only for test purpose!");
    }

    async sendErrorFile(content) {
        await this.send(
            "error",
            `Today: ${new Date().toLocaleString()} error Logs.`,
            content
        );
    }

    async sendPasswordReset() {
        await this.send(
            "passReset",
            "Your password reset token (valid for 60 seconds)"
        );
    }

    async sendRegisterOtp() {
        await this.send("registerOtp", "Your register OTP (valid for 60 seconds)");
    }

    async sendRegisterAccount() {
        await this.send("shareRegisterCred", "Your account has been created");
    }

    async sendContactUsDetails() {
        await this.send("contactUs", "New Contact Form Submission");
    }
}

module.exports = Email;
