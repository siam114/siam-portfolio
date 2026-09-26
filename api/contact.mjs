const ALLOWED_ORIGINS = ["https://siam-portfolio-theta.vercel.app"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rateBuckets = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return null;
  if (ALLOWED_ORIGINS.indexOf(origin) >= 0) return origin;
  try {
    const host = new URL(origin).hostname;
    if (host === "localhost" || host === "127.0.0.1") return origin;
  } catch (e) { /* not a url */ }
  return false;
}

function send(res, status, data, origin) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.end(JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail(user) {
  const subject = user.subject || "General Inquiry";
  const lines = [
    "<p>A new message was submitted through the Contact Us form.</p>",
    "<table style=\"border-collapse:collapse;font-family:Arial,Helvetica,sans-serif\" cellpadding=\"8\" cellspacing=\"0\">",
    "<tr><td style=\"background:#f4f4f4;border:1px solid #ddd;font-weight:bold\">Name</td><td style=\"border:1px solid #ddd\">" + escapeHtml(user.name) + "</td></tr>",
    "<tr><td style=\"background:#f4f4f4;border:1px solid #ddd;font-weight:bold\">Email</td><td style=\"border:1px solid #ddd\"><a href=\"mailto:" + escapeHtml(user.email) + "\">" + escapeHtml(user.email) + "</a></td></tr>",
    "<tr><td style=\"background:#f4f4f4;border:1px solid #ddd;font-weight:bold\">Subject</td><td style=\"border:1px solid #ddd\">" + escapeHtml(subject) + "</td></tr>",
    "<tr><td style=\"background:#f4f4f4;border:1px solid #ddd;font-weight:bold\">Message</td><td style=\"border:1px solid #ddd\">" + escapeHtml(user.message).replace(/\n/g, "<br>") + "</td></tr>",
    "<tr><td style=\"background:#f4f4f4;border:1px solid #ddd;font-weight:bold\">Website</td><td style=\"border:1px solid #ddd\">" + escapeHtml(user.siteUrl) + "</td></tr>",
    "</table>"
  ];
  return "<p style=\"font-family:Arial,Helvetica,sans-serif\"><strong>New Contact Form Submission</strong></p>" + lines.join("");
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  if (req.socket && req.socket.remoteAddress) return req.socket.remoteAddress;
  return "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const max = parseInt(process.env.RATE_LIMIT_MAX || "5", 10);
  const hits = (rateBuckets.get(ip) || []).filter(function (t) { return now - t < windowMs; });
  if (hits.length === 0) {
    rateBuckets.delete(ip);
  }
  if (hits.length >= max) {
    rateBuckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(ip, hits);
  return false;
}

export default async function handler(req, res) {
  const origin = isAllowedOrigin(req.headers.origin);

  if (origin === false) {
    return send(res, 403, { error: "Origin not allowed" }, null);
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader("Vary", "Origin");
    return res.end();
  }

  const path = String(req.url || "/").split("?")[0];

  if (req.method === "GET" && path.indexOf("_health") >= 0) {
    return send(res, 200, {
      hasRESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      EMAIL_TO: process.env.EMAIL_TO || null,
      EMAIL_FROM: process.env.EMAIL_FROM || null,
      SITE_URL: process.env.SITE_URL || null
    }, origin);
  }

  if (req.method !== "POST") {
    return send(res, 405, { error: "Method not allowed" }, origin);
  }

  if (rateLimited(clientIp(req))) {
    return send(res, 429, { error: "Too many requests" }, origin);
  }

  let body = null;
  try {
    body = (typeof req.body === "object" && req.body !== null) ? req.body : JSON.parse(req.read() || "{}");
  } catch (e) {
    return send(res, 400, { error: "Invalid JSON body" }, origin);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const projectType = typeof body.projectType === "string" ? body.projectType.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (body.website) {
    return send(res, 400, { error: "Invalid submission" }, origin);
  }

  if (!name || name.length < 1 || name.length > 100) {
    return send(res, 400, { error: "Name is required" }, origin);
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return send(res, 400, { error: "A valid email is required" }, origin);
  }
  if (projectType.length > 100) {
    return send(res, 400, { error: "Invalid project type" }, origin);
  }
  if (subject.length > 200) {
    return send(res, 400, { error: "Invalid subject" }, origin);
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return send(res, 400, { error: "A message of at least 10 characters is required" }, origin);
  }

  const emailTo = process.env.EMAIL_TO || "smsiam987@gmail.com";
  const emailFrom = process.env.EMAIL_FROM || "Siam.Dev Contact <onboarding@resend.dev>";
  const siteUrl = process.env.SITE_URL || "https://siam-portfolio-theta.vercel.app";

  let resendOk = false;
  let resendStatus = 502;
  let resendBody = "";

  try {
    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + (process.env.RESEND_API_KEY || ""),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [emailTo],
        reply_to: email,
        subject: "New Contact Form Message - " + subject,
        html: buildEmail({ name: name, email: email, subject: subject, message: message, siteUrl: siteUrl })
      })
    });
    resendOk = resend.ok;
    resendStatus = resend.status;
    resendBody = await resend.text();
  } catch (e) {
    console.error("Contact email request failed:", e && e.message ? e.message : e);
    return send(res, 502, { error: "Email service failed" }, origin);
  }

  if (!resendOk) {
    console.error("Contact email provider error:", resendStatus, String(resendBody).slice(0, 500));
    return send(res, 502, { error: "Email service failed" }, origin);
  }

  send(res, 200, { ok: true, id: resendBody ? String(resendBody) : null }, origin);
}