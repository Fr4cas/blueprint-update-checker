# Blueprint QR Viewer

A lightweight web app that ensures construction workers always access the **latest blueprint version** using a **QR code**. Designed for clarity, speed, and ease of use on-site.

---

## Features

- **QR Code Generator**: Automatically generates a QR code that links to the latest uploaded blueprint (PDF).
- **Version Tracking**: Displays blueprint version, upload date, and version status.
- **QR Scanner Interface**: Workers can scan a code to instantly verify the blueprint’s validity.
- **Simple Web Interface**: Optimized for desktop, tablet, and on-site mobile use.
- **Trimble Connect API Integration**: Securely accessess bluepreint data via Trimble's OAuth-protected APIs using stored refresh tokens.

---

## Tech Stack

- **Frontend**: React, HTML5 QR Scanner, QR Code Generator
- **Backend**: 
  - Node.js + Express (core server framework)
  - Multer (file upload handling)
  - CORS (cross-origin request support)
  - dotenv (environment variable config)
  - node-fetch (Trimble API requests via OAuth)
  - pdf-lib (PDF QR code embedding)
  - qrcode (generate QR image from link)
- **Storage**: Local file system (can be extended to cloud storage)
- **Authentication**: Trimble OAuth 2.0 (`refresh_token` flow)

---

## API Intergration (Trimble Connect)

- Access tokens are refreshed automatically before API requests.
- API usage complies with [Trimble’s SDK License](https://www.trimble.com/en/products/trimble-connect/sdk-iu-license-agreement).
- Secrets and tokens are stored in .env

---

## Languages

- Interface: English + Traditional Chinese (planned)
- Code: JavaScript (React, Node.js)

---

## Licensing

This project uses the Trimble Connect SDK under the [Trimble Internal Use License](./LICENSE.trimble.txt). This limits use to internal applications and requires compliance with Trimble's API terms.

---

## Status

**Actively being rebuilt** — Project was reset from a legacy JS/CSS version to a modern full stack architecture.
