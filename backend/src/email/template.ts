import { EmailContents } from "../types";
import { promisify } from "util";
import { readFile } from "fs";

/**
 * Fills an email template with the provided values.
 *
 * @param {EmailContents} template - The email template containing placeholders.
 * @param {Object.<string, string>} values - An object mapping placeholder keys to their replacement values.
 * @returns {Promise<EmailContents>} - A promise that resolves to the filled email content.
 */
export async function fillEmailTemplate(
  template: EmailContents,
  values: { [key: string]: string },
): Promise<EmailContents> {
  let filledSubject = template.subject;
  let filledText = template.text;
  let filledHtml = await promisify(readFile)("src/email/" + template.html, "utf-8");

  for (const key in values) {
    const placeholder = `{{${key}}}`;
    const value = values[key];

    filledSubject = filledSubject.replace(new RegExp(placeholder, "g"), value);
    filledText = filledText.replace(new RegExp(placeholder, "g"), value);
    filledHtml = filledHtml.replace(new RegExp(placeholder, "g"), value);
  }

  return {
    subject: filledSubject,
    text: filledText,
    html: filledHtml,
  };
}

/**
 * Email content for booking request notifications.
 *
 * @constant {EmailContents}
 */
export const BOOKING_REQUEST: EmailContents = {
  subject: "New Booking Request: Booking ID {{bookingid}}",
  text: "Hello {{name}},\n\nYour booking request #{{bookingid}} has been submitted.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you for your booking.",
  html: "templates/bookingRequest.html",
};

/**
 * Email content for booking edit notifications.
 *
 * @constant {EmailContents}
 */
export const BOOKING_EDIT: EmailContents = {
  subject: "Booking Edited: Booking ID {{bookingid}}",
  text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been edited.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you for your booking.",
  html: "templates/bookingEdit.html",
};

/**
 * Email content for booking deletion notifications.
 *
 * @constant {EmailContents}
 */
export const BOOKING_DELETE: EmailContents = {
  subject: "Booking Deleted: Booking ID {{bookingid}}",
  text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been deleted.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you.",
  html: "templates/bookingDelete.html",
};

/**
 * Email content for booking approval notifications.
 *
 * @constant {EmailContents}
 */
export const BOOKING_APPROVE: EmailContents = {
  subject: "Booking Approved: Booking ID {{bookingid}}",
  text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been approved.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you.",
  html: "templates/bookingDelete.html",
};

/**
 * Email content for booking decline notifications.
 *
 * @constant {EmailContents}
 */
export const BOOKING_DECLINE: EmailContents = {
  subject: "Booking Declined: Booking ID {{bookingid}}",
  text: "Hello {{name}},\n\nYour booking #{{bookingid}} has been declined.\n\nDetails:\n-----------\nStart Time (Sydney): {{starttime}}\nEnd Time (Sydney): {{endtime}}\nSpace ID: {{spaceid}}\nStatus: {{currentstatus}}\n\nDescription:\n-----------\n{{description}}\n\nThank you.",
  html: "templates/bookingDelete.html",
};
