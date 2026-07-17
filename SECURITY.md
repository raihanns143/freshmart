# Security Policy — FreshMart Pro

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x (current) | ✅ Active security updates |
| < 1.0 | ❌ No longer supported |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please disclose it responsibly by:

### Option A — GitHub Private Advisory (Preferred)
1. Go to the repository on GitHub
2. Click **Security** → **Advisories** → **Report a vulnerability**
3. Fill in the details and submit

### Option B — Direct Email
Send a detailed report to: **security@freshmart.example.com**  
Include `[SECURITY]` in the subject line.

---

## What to Include in Your Report

Please provide as much of the following as possible:

- **Type of issue** (e.g., SQL injection, XSS, authentication bypass, privilege escalation)
- **Location** — file path(s), API route, or UI component
- **Reproduction steps** — exact steps to reproduce the issue
- **Impact** — what an attacker could achieve by exploiting this
- **Suggested fix** — if you have one
- **Your environment** — browser, OS, app version

---

## Response Timeline

| Stage | Timeline |
|-------|----------|
| Initial acknowledgement | Within **48 hours** |
| Triage & assessment | Within **5 business days** |
| Fix development | Within **14 days** (critical), **30 days** (medium/low) |
| Public disclosure | After fix is released |

---

## Responsible Disclosure Policy

We follow responsible disclosure:

1. You report the vulnerability privately
2. We acknowledge receipt and investigate
3. We develop and test a fix
4. We release the fix and credit you in the release notes (if you wish)
5. You may publicly disclose **after** the fix is released or after **90 days** — whichever comes first

---

## Security Measures in FreshMart

For transparency, here are the core security measures implemented:

| Area | Measure |
|------|---------|
| **Passwords** | bcryptjs with cost factor 10 |
| **Sessions** | Auth.js JWT, 30-day expiry, HttpOnly cookie |
| **RBAC** | Next.js middleware enforced on every request |
| **SQL Injection** | Prevented by Prisma parameterised queries (no raw SQL) |
| **CSRF** | Protected by Auth.js CSRF tokens |
| **XSS** | React auto-escapes all rendered values |
| **Secrets** | Environment variables never exposed to the client |
| **Payments** | Stripe webhook signature verification |
| **Audit Trail** | All admin mutations are logged in `AuditLog` |
| **Rate Limiting** | Planned for v1.1 |

---

## Known Limitations

- Rate limiting on the login endpoint is **planned** (not yet implemented in v1.0)
- Email verification for new accounts is **planned** for v1.1

---

Thank you for helping keep FreshMart and its users safe! 🔐
