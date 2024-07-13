import { eq } from "drizzle-orm"
import { person } from '../../drizzle/schema';

import { db, emailTransporter } from '../index';
import { fillEmailTemplate } from './template';
import {
    Booking,
    EmailContents,
    EmailRecipient
} from '../types';

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

export async function sendBookingEmail(zid: number, booking: Booking, template: EmailContents) {

    const emailRecipient = await getEmailRecipient(zid);

    const emailContent = {
        name: emailRecipient.name,
        bookingid: String(booking.id),
        starttime: String(booking.starttime),
        endtime: String(booking.endtime),
        spaceid: booking.spaceid,
        currentstatus: booking.currentstatus,
        description: booking.description
    };

    const email = await fillEmailTemplate(template, emailContent);

    const emailInfo = await emailTransporter.sendMail({
        from: EMAIL_SENDER,
        to: emailRecipient.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
    });
}
