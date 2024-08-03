import { eq } from "drizzle-orm";
import { config, person } from "../../drizzle/schema";

import { db, emailTransporter } from "../index";
import { fillEmailTemplate } from "./template";
import { Booking, EmailContents, EmailRecipient } from "../types";

// For testing
const EMAIL_SENDER = '"Wilma 👻" <wilma44@ethereal.email>';

/**
 * Checks if email notifications are enabled globally.
 *
 * @returns {Promise<boolean>} - Returns true if global email notifications are enabled, false otherwise.
 * @throws {Error} - Throws an error if there is an issue fetching the global-email config.
 */
export async function emailsEnabledGlobally(): Promise<boolean> {
  try {
    const result = await db
      .select({ value: config.value })
      .from(config)
      .where(eq(config.key, "global-email"))
      .limit(1);

    if (result.length !== 1) {
      return false;
    }

    return (result[0]?.value ?? "").toLowerCase() === "true";
  } catch (e) {
    throw new Error(`Error fetching global-email config: ${e}`);
  }
}

/**
 * Retrieves the email recipient information for a given zid.
 *
 * @param {number} zid - The unique identifier for a person.
 * @returns {Promise<EmailRecipient>} - Returns an object containing the name and email of the recipient.
 * @throws {Error} - Throws an error if the zid is invalid or email address cannot be retrieved.
 */
export async function getEmailRecipient(zid: number): Promise<EmailRecipient> {
  const res = await db
    .select({
      name: person.fullname,
      email: person.email,
    })
    .from(person)
    .where(eq(person.zid, zid))
    .limit(1);

  if (res.length != 1) {
    throw new Error("Invalid zid: could not get email address");
  }

  return res[0];
}

/**
 * Sends a booking confirmation email to the specified recipient.
 *
 * @param {number} zid - The unique identifier for a person.
 * @param {Booking} booking - The booking details.
 * @param {EmailContents} template - The email template to be used.
 * @returns {Promise<boolean>} - Returns true if the email was sent successfully, false otherwise.
 */
export async function sendBookingEmail(
  zid: number,
  booking: Booking,
  template: EmailContents,
): Promise<boolean> {
  // Check that email sending is enabled globally
  const sendEmail = await emailsEnabledGlobally();
  if (!sendEmail) {
    return false;
  }

  // Check if recipient has this email setting type turned off

  const emailRecipient = await getEmailRecipient(zid);

  const emailContent = {
    name: emailRecipient.name,
    bookingid: String(booking.id),
    starttime: booking.starttime,
    endtime: booking.endtime,
    spaceid: booking.spaceid,
    currentstatus: booking.currentstatus,
    description: booking.description,
  };

  const email = await fillEmailTemplate(template, emailContent);

  await emailTransporter.sendMail({
    from: EMAIL_SENDER,
    to: emailRecipient.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return true;
}
