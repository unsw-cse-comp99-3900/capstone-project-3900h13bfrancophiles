import { EmailContents } from '../types';

const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

export async function fillEmailTemplate(template: EmailContents, values: { [key: string]: string }): Promise<EmailContents> {

    let filledSubject = template.subject;
    let filledText = template.text;
    let filledHtml = await readFileAsync(('src/email/' + template.html), 'utf-8');

    for (const key in values) {
        const placeholder = `{{${key}}}`;
        const value = values[key];

        filledSubject = filledSubject.replace(new RegExp(placeholder, 'g'), value);
        filledText = filledText.replace(new RegExp(placeholder, 'g'), value);
        filledHtml = filledHtml.replace(new RegExp(placeholder, 'g'), value);
    }

    return {
        subject: filledSubject,
        text: filledText,
        html: filledHtml
    };
}
export const BOOKING_REQUEST: EmailContents = {
    subject: "New Request: Booking ID {{bookingid}}",
    text: "Hello {{name}}, your booking request with ID {{bookingid}} has been submitted.",
    html: "templates/bookingRequest.html"
}
