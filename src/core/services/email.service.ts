import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

class EmailService {

    private username: string;
    private password: string;
    private service: string;

    private transporter: nodemailer.Transporter;

    constructor(username?: string, password?: string, service?: string) {
        this.username = username || process.env.EMAIL_USERNAME as string;
        this.password = password || process.env.EMAIL_PASSWORD as string;
        this.service = service || process.env.EMAIL_SERVICE as string;

        this.transporter = nodemailer.createTransport({
            service: this.service,
            auth: { user: this.username, pass: this.password }
        });

        console.info("Email service created");
    }

    async send(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
            from: this.username,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        try{
            const res = await this.transporter.sendMail(mailOptions);
            console.info("Email sent " + res.response);
        }
        catch(err){
            console.info(err);
        }
    }

}


export { EmailService };