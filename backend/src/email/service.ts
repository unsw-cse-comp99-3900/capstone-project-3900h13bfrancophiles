import { emailTransporter } from '../index';
import { Booking, EmailRecipient } from '../types';
import { fillEmailTemplate, BOOKING_REQUEST } from './template';
import { db } from '../index'
import { eq } from "drizzle-orm"
import { person } from '../../drizzle/schema';

// For testing
const EMAIL_SENDER = '"Wilma 👻" <wilma44@ethereal.email>';
const EMAIL_PASS = 'GWCxu8xEeJAwGAMGzF'

export async function getEmailRecipient(zid: number) : Promise<EmailRecipient> {

    const res = await db
        .select({
            name: person.fullname,
            email: person.email
        })
        .from(person)
        .where(eq(person.zid, zid))
        .limit(1);

    if (res.length != 1) {
        throw new Error("Invalid zid: could not get email address");
    }

    return res[0];
}

export async function sendBookingRequest(zid: number, booking: Booking) {

    const emailRecipient = await getEmailRecipient(zid);
    const emailContent = { name: emailRecipient.name, bookingid: String(booking.id) };
    const email = await fillEmailTemplate(BOOKING_REQUEST, emailContent);

    const emailInfo = await emailTransporter.sendMail({
        from: '"Wilma 👻" <wilma44@ethereal.email>',
        to: emailRecipient.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
    });

    // console.log("Email sent: %s", info.messageId);
}
