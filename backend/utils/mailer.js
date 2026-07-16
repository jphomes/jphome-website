const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Shared visual shell so every mail (admin notification + user auto-reply) looks consistent.
function shell({ heading, bodyHtml }) {
  return `
  <div style="background:#12181B;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:2px;overflow:hidden;">
            <tr>
              <td style="background:#12181B;padding:24px 32px;">
                <span style="color:#B08D57;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">Sondagar Estates</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:#12181B;font-weight:normal;">${heading}</h1>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#3a3a3a;">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#EDE7DD;font-family:Arial,sans-serif;font-size:11px;color:#7a7a7a;">
                This message was sent from the enquiry form on sondagarestates.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

/**
 * Sends two emails for every enquiry:
 * 1. To the admin (Tom Sondagar) — the enquiry details
 * 2. To the enquirer — a generic auto-reply acknowledgement template
 */
async function sendEnquiryMails(enquiry) {
  const { name, email, phone, message, propertyTitle, source } = enquiry;

  const adminHtml = shell({
    heading: "New Enquiry Received",
    bodyHtml: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>Regarding:</strong> ${propertyTitle ? propertyTitle : source}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  });

  const userHtml = shell({
    heading: `Thank you, ${name.split(" ")[0]}`,
    bodyHtml: `
      <p>We've received your enquiry${propertyTitle ? ` about <strong>${propertyTitle}</strong>` : ""} and a member of the Sondagar Estates team will get back to you within 24 hours.</p>
      <p style="margin-top:20px;padding:16px;background:#EDE7DD;border-left:3px solid #B08D57;">
        <em>"${message}"</em>
      </p>
      <p style="margin-top:20px;">In the meantime, feel free to browse more listings on our website or reply directly to this email with any additional details.</p>
      <p style="margin-top:24px;">Warm regards,<br/>Tom Sondagar<br/>Sondagar Estates</p>
    `,
  });

  await Promise.all([
    transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.ADMIN_NOTIFY_EMAIL,
      replyTo: email,
      subject: `New Enquiry: ${propertyTitle || source}`,
      html: adminHtml,
    }),
    transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "We've received your enquiry — Sondagar Estates",
      html: userHtml,
    }),
  ]);
}

module.exports = { sendEnquiryMails, transporter };
