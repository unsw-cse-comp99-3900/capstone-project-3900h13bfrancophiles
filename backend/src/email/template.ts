import { EmailContents } from '../types';

export function fillEmailTemplate(template: EmailContents, values: { [key: string]: string }): EmailContents {

    let filledSubject = template.subject;
    let filledText = template.text;
    let filledHtml = template.html;

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
    text: "Hello {{name}}, your booking request with ID {{bookingId}} has been submitted.",
    html: "<b>Hello {{name}}, your booking request with ID {{bookingId}} has been submitted.</b>"
}
