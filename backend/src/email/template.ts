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
    subject: "New Booking Request: Booking ID {{bookingid}}",
    text: "Hello {{name}},\n\nYour booking request #{{bookingid}} has been submitted.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you for your booking.",
    html: "templates/bookingRequest.html"
}

export const BOOKING_EDIT: EmailContents = {
    subject: "Booking Edited: Booking ID {{bookingid}}",
    text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been edited.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you for your booking.",
    html: "templates/bookingEdit.html"
}

export const BOOKING_DELETE: EmailContents = {
    subject: "Booking Deleted: Booking ID {{bookingid}}",
    text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been deleted.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you.",
    html: "templates/bookingDelete.html"
}
