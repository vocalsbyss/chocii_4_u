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

import tls from "tls";
import net from "net";

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
 * Sends email using raw SMTP over TLS (e.g. Gmail port 465)
 */
async function sendViaSmtp(
  toEmail: string,
  subject: string,
  htmlContent: string,
  plainText: string
): Promise<boolean> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
  const from = process.env.SMTP_FROM || `chocii 4 u <${user}>`;

  if (!user || !pass) return false;

  return new Promise((resolve) => {
    let socket: tls.TLSSocket | net.Socket;

    const timeout = setTimeout(() => {
      try {
        socket.destroy();
      } catch {}
      console.warn("[SMTP] Socket timeout after 5s");
      resolve(false);
    }, 5000);

    const onConnect = () => {
      let stage = 0;
      let buffer = "";

      const sendCommand = (cmd: string) => {
        socket.write(cmd + "\r\n");
      };

      socket.on("data", (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split("\r\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line) continue;
          const code = parseInt(line.substring(0, 3), 10);

          if (stage === 0 && code === 220) {
            stage = 1;
            sendCommand(`EHLO chocii4u.com`);
          } else if (stage === 1 && code === 250) {
            stage = 2;
            sendCommand(`AUTH LOGIN`);
          } else if (stage === 2 && code === 334) {
            stage = 3;
            sendCommand(Buffer.from(user).toString("base64"));
          } else if (stage === 3 && code === 334) {
            stage = 4;
            sendCommand(Buffer.from(pass).toString("base64"));
          } else if (stage === 4 && code === 235) {
            stage = 5;
            sendCommand(`MAIL FROM:<${user}>`);
          } else if (stage === 5 && code === 250) {
            stage = 6;
            sendCommand(`RCPT TO:<${toEmail}>`);
          } else if (stage === 6 && code === 250) {
            stage = 7;
            sendCommand(`DATA`);
          } else if (stage === 7 && code === 354) {
            stage = 8;
            const message = [
              `From: ${from}`,
              `To: <${toEmail}>`,
              `Subject: ${subject}`,
              `MIME-Version: 1.0`,
              `Content-Type: text/html; charset=UTF-8`,
              ``,
              htmlContent,
              `.`,
            ].join("\r\n");
            sendCommand(message);
          } else if (stage === 8 && code === 250) {
            stage = 9;
            sendCommand(`QUIT`);
            clearTimeout(timeout);
            socket.end();
            resolve(true);
            return;
          } else if (code >= 400) {
            console.warn(`[SMTP] Error at stage ${stage}:`, line);
            clearTimeout(timeout);
            socket.destroy();
            resolve(false);
            return;
          }
        }
      });
    };

    if (port === 465) {
      socket = tls.connect({ host, port, rejectUnauthorized: false }, onConnect);
    } else {
      socket = net.connect({ host, port }, onConnect);
    }

    socket.on("error", (err) => {
      clearTimeout(timeout);
      console.warn("[SMTP] Connection error:", err.message);
      resolve(false);
    });
  });
}

/**
 * Dispatch verification OTP to customer's email
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

  // 1. Try Resend if configured
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  if (resendApiKey) {
    try {
      const from = process.env.EMAIL_FROM || "chocii 4 u <onboarding@resend.dev>";
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
    } catch (err) {
      console.error("[Resend] Error:", err);
    }
  }

  // 2. Try Brevo if configured
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
    } catch (err) {
      console.error("[Brevo] Error:", err);
    }
  }

  // 3. Try standard SMTP (e.g. Gmail with App Password)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const smtpSuccess = await sendViaSmtp(toEmail, subject, html, plainText);
    if (smtpSuccess) {
      return { success: true, provider: "smtp" };
    }
  }

  // 4. Fallback: Log to secure server console (always works in development/testing with 0 costs)
  console.log(
    `\n======================================================\n[CHOCII 4 U FREE EMAIL OTP DISPATCH]\nRecipient Email : ${toEmail}\nCustomer Name   : ${customerName}\nMobile Phone    : ${phone || "N/A"}\nVerification Code: ${code}\nSubject         : ${subject}\n======================================================\n`
  );

  return {
    success: true,
    provider: "development",
  };
}
