import { emailTransporter } from '../index';

export async function sendBookingConfirmation() {
    const info = await emailTransporter.sendMail({
        from: '"Wilma 👻" <wilma44@ethereal.email>',
        to: "user1@example.com, user2@example.com",
        subject: "Booking Confirmed",
        text: "Your booking has been confirmed!",
        html: "<b>Your booking has been confirmed!</b>",
    });

    console.log("Email sent: %s", info.messageId);
}
