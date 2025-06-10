# Cloudflare – Secure Identity Worker

A hands-on technical demo using **Cloudflare Workers**, **Zero Trust**, **Tunnels**, and **R2** to protect a Flask-based origin application and return user identity information securely.



---

## 🧱 Architecture Overview

```
[User Browser]
     |
     v
[Cloudflare Access / Zero Trust (SSO)]
     |
     v
[tunnel.yourdomain.com/secure] → [Cloudflare Worker] → [R2 Bucket for flags]
                                                  
                                            ↘
                                             [AWS EC2 (Flask App via Cloudflare Tunnel)]
```

---

## 🔧 Tech Stack

| Layer         | Technology                        |
|--------------|------------------------------------|
| Identity      | Cloudflare Zero Trust + Google IdP |
| Network       | Cloudflare Tunnel                  |
| Server        | AWS EC2 + Python Flask             |
| TLS           | Let's Encrypt (Full-Strict Mode)   |
| Storage       | Cloudflare R2 (private bucket)     |
| Serverless    | Cloudflare Workers (Wrangler)      |
| Auth UI       | Access App with email/domain rules |

---

## 🚀 Features

- 🔐 SSO-secured access to `/secure` path (Cloudflare Access + Google IdP)
- 📧 Returns authenticated email, timestamp, and origin country
- 🌍 Clickable country link loads country flag from R2
- 🔒 Full-Strict TLS with Cloudflare origin verification
- ☁️ Origin server hidden via Cloudflare Tunnel
- 🧑‍💻 Code deployed via Wrangler CLI and open-sourced on GitHub

---

## ⚙️ Setup Instructions

### 1. Deploy Flask App on AWS
```bash
# Simple app that echoes headers
git clone https://github.com/yourusername/header-echo-flask
cd header-echo-flask
sudo python3 app.py  # runs on port 443 with HTTPS
```
Use Let's Encrypt via Certbot to issue a trusted TLS certificate.

### 2. Set Up Cloudflare Tunnel



### 3. Configure Zero Trust Access
- Go to Cloudflare Zero Trust > Access > Applications
- Protect `https://tunnel.yourdomain.com/secure`
- Allow access to your email and `@cloudflare.com` domain

### 4. Deploy Worker
```bash
wrangler init cf-secure-worker
# Add R2 config to wrangler.jsonc
# Add Worker code to src/index.js (see full source in repo)
wrangler publish
```
Set route to `tunnel.yourdomain.com/secure*` in Cloudflare dashboard.

### 5. Upload Flags to R2
- Create private R2 bucket: `flags`
- Upload SVGs like: `flags/us.png`, `flags/au.png`, etc.

---

## 🧪 Test It

1. Visit: `https://tunnel.yourdomain.com/secure`
2. Authenticate via SSO (Google login)
3. See: `you@example.com authenticated at 2025-06-10T01:23:45Z from AU`
4. Click `AU` → Loads PNG flag from `/secure/AU`

---

## 📁 Repository Structure

```bash
cf-secure-worker/
├── wrangler.toml
├── src/
│   └── index.js       # Main Worker logic
├── R2_BUCKET/flags/   # Country flag PNGs
└── README.md          # This file
```

---

## 📦 GitHub Repository

This repo is available publicly at:


---

## 📌 License

MIT License. 

---
For questions or setup support, feel free to reach out via the issues tab!
