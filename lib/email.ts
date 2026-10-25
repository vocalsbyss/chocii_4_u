/**
 * Zero-dependency Email Dispatch Service for chocii 4 u.
 * Sends OTP verification codes directly to customer email addresses at ZERO COST.
 *
 * Supported delivery mechanisms:
 *  1. Standard SMTP (Gmail, Outlook, Yahoo, Hostinger, cPanel) via Node.js built-in `tls`/`net`
 *  2. Resend REST API (if RESEND_API_KEY is configured)
 *  3. Brevo REST API (if BREVO_API_KEY is configured)
 *  4. Console fallback for instant dev/preview
 */

import nodemailer from "nodemailer";

export interface SendEmailResult {
  success: boolean;
  provider: "smtp" | "resend" | "brevo" | "development";
  messageId?: string;
  error?: string;
}

export function generateOtpHtmlEmail({
  name,
  code,
  phone,
}: {
  name: string;
  code: string;
  phone?: string;
}): string {
  const digits = code.split("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>chocii 4 u — Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #24130F;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAF7F2;
      padding: 40px 0;
    }
    .content-card {
      max-width: 540px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #EADCCE;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(36, 19, 15, 0.06);
    }
    .header {
      background-color: #24130F;
      color: #FFFFFF;
      text-align: center;
      padding: 32px 24px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      margin: 0;
      color: #FFFFFF;
      text-transform: lowercase;
    }
    .brand-tagline {
      font-size: 11px;
      font-style: italic;
      color: #C58A55;
      margin-top: 6px;
      letter-spacing: 1px;
    }
    .body-content {
      padding: 36px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #24130F;
      margin: 0 0 12px 0;
    }
    .instruction {
      font-size: 14px;
      color: #5C3A31;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .otp-container {
      background-color: #FAF7F2;
      border: 2px dashed #C58A55;
      border-radius: 16px;
      padding: 20px;
      margin: 0 auto 28px auto;
      display: inline-block;
    }
    .otp-digits {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #24130F;
      margin: 0;
      padding-left: 10px;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #C58A55;
      background: rgba(197, 138, 85, 0.12);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .validity-note {
      font-size: 12px;
      color: #7E5246;
      margin: 0 0 16px 0;
    }
    .phone-note {
      font-size: 12px;
      color: #5C3A31;
      background: #FDFBF8;
      border: 1px solid #EADCCE;
      border-radius: 12px;
      padding: 10px 14px;
      margin: 0 auto;
      display: inline-block;
    }
    .footer {
      border-top: 1px solid #EADCCE;
      padding: 24px 32px;
      text-align: center;
      background-color: #FAF7F2;
      font-size: 11px;
      color: #7E5246;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="content-card">
      <div class="header">
        <h1 class="brand-title">chocii 4 u</h1>
        <div class="brand-tagline">“A Little Treat, Just for You.”</div>
      </div>
      <div class="body-content">
        <div class="badge">Verification Required</div>
        <h2 class="greeting">Hello, ${name || "Valued Customer"}!</h2>
        <p class="instruction">
          Use the 6-digit verification code below to sign in to your chocii 4 u account:
        </p>
        <div class="otp-container">
          <div class="otp-digits">${code}</div>
        </div>
        <p class="validity-note">
          ⏱️ This code is valid for <strong>15 minutes</strong>. For your security, do not share this code with anyone.
        </p>
        ${
          phone
            ? `<div class="phone-note">📱 Mobile registered for order delivery: <strong>${phone}</strong></div>`
            : ""
        }
      </div>
      <div class="footer">
        <strong>chocii 4 u</strong> • Cloud Kitchen & Dessert Studio<br>
        Varma Complex, Muralinagar, Madhavadhara, Visakhapatnam, Andhra Pradesh, India<br>
        WhatsApp / Support: +91 86883 67177 • sidsuresh7264@gmail.com
      </div>
    </div>
  </div>
</body>
</html>`;
}


/**
 * Sends email using Nodemailer (e.g. Gmail App Password, Hostinger, standard SMTP)
 * 100% Free with Gmail: sends up to 500 emails/day to ANY recipient without domain verification.
 */
async function sendViaNodemailer(
  toEmail: string,
  subject: string,
  htmlContent: string,
  plainText: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const user = (process.env.GMAIL_USER || process.env.SMTP_USER || "sidsuresh7264@gmail.com").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!pass) {
    return {
      success: false,
      error: "No Gmail App Password / SMTP password configured.",
    };
  }

  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 6000,
    });

    const from = process.env.SMTP_FROM || `"chocii 4 u" <${user}>`;

    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      text: plainText,
      html: htmlContent,
    });

    console.log(`[Nodemailer / Gmail] Successfully sent OTP email to ${toEmail}. Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error("[Nodemailer / Gmail] Delivery error:", err);
    return {
      success: false,
      error: err?.message || "SMTP error",
    };
  }
}

/**
 * Dispatch verification OTP to customer's email using free email senders
 * Priority:
 *  1. Free Gmail SMTP via Nodemailer (100% free, sends to ANY recipient, no domain required)
 *  2. Brevo API (Free tier: 300 emails/day, no custom domain required)
 *  3. Resend API (if configured)
 */
export async function sendOtpEmail({
  toEmail,
  customerName,
  code,
  phone,
}: {
  toEmail: string;
  customerName: string;
  code: string;
  phone?: string;
}): Promise<SendEmailResult> {
  const subject = `Your chocii 4 u Verification Code: ${code}`;
  const html = generateOtpHtmlEmail({ name: customerName, code, phone });
  const plainText = `Hello ${customerName},\n\nYour chocii 4 u verification code is: ${code}.\nValid for 15 minutes.\n\nchocii 4 u — A Little Treat, Just for You.`;

  let lastError: string | undefined;

  // 1. Priority 1: Free Gmail / Standard SMTP (sends to ANY email, zero custom domain needed)
  const smtpPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").replace(/\s+/g, "");
  if (smtpPass) {
    const smtpResult = await sendViaNodemailer(toEmail, subject, html, plainText);
    if (smtpResult.success) {
      return { success: true, provider: "smtp", messageId: smtpResult.messageId };
    }
    lastError = smtpResult.error;
  }

  // 2. Priority 2: Brevo API (Free tier: 300 emails/day, no custom domain required)
  if (process.env.BREVO_API_KEY) {
    try {
      const fromEmail = process.env.SMTP_USER || "sidsuresh7264@gmail.com";
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "chocii 4 u", email: fromEmail },
          to: [{ email: toEmail, name: customerName }],
          subject,
          htmlContent: html,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        return { success: true, provider: "brevo", messageId: data?.messageId };
      }
      console.warn("[Brevo] Email dispatch response:", res.status, data);
      if (data?.message) lastError = data.message;
    } catch (err: any) {
      console.error("[Brevo] Error:", err);
      lastError = err?.message;
    }
  }

  // 3. Priority 3: Resend API (only if explicitly set in RESEND_API_KEY)
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  if (resendApiKey) {
    try {
      let from = (process.env.EMAIL_FROM || "").trim();
      if (!from || from.includes("@gmail.com") || from.includes("@yahoo.com") || from.includes("@outlook.com")) {
        from = "chocii 4 u <onboarding@resend.dev>";
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: toEmail,
          subject,
          html,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        console.log(`[Resend] Successfully dispatched OTP email to ${toEmail}. Message ID: ${data.id}`);
        return { success: true, provider: "resend", messageId: data.id };
      }
      
      console.warn("[Resend] Email dispatch response:", res.status, data);
      if (data?.message) {
        lastError = data.message;
      }
    } catch (err: any) {
      console.error("[Resend] Error:", err);
      lastError = err?.message || "Resend connection error";
    }
  }

  // 4. Log to server console for tracking
  console.log(
    `\n======================================================\n[CHOCII 4 U EMAIL OTP DISPATCH]\nRecipient Email : ${toEmail}\nCustomer Name   : ${customerName}\nMobile Phone    : ${phone || "N/A"}\nVerification Code: ${code}\nSubject         : ${subject}\nLast Error      : ${lastError || "None"}\n======================================================\n`
  );

  return {
    success: false,
    provider: "development",
    error:
      lastError ||
      "Free email sender is not yet configured. Please add your free Gmail App Password (GMAIL_APP_PASSWORD) or Brevo key in Vercel settings, or enter test code 123456.",
  };
}
