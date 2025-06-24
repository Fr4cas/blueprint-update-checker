# Blueprint QR Viewer

A lightweight web app that ensures construction workers always access the **latest blueprint version** using a **QR code**. Designed for clarity, speed, and ease of use on-site.

---

## Features

- **QR Code Generator**: Automatically generates a QR code that links to the latest uploaded blueprint (PDF).
- **Version Tracking**: Displays blueprint version, upload date, and version status.
- **QR Scanner Interface**: Workers can scan a code to instantly verify the blueprint’s validity.
- **Simple Web Interface**: Optimized for desktop, tablet, and on site mobile use.
- **Local File Management**: Operates without reliance on third party APIs for file handling or version control.

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
- **Authentication**: _None required_ (no longer dependent on OAuth services)

---

## Deprecated: Trimble Connect Integration

This project **previously used the Trimble Connect API** for blueprint storage and access via OAuth tokens and `refresh_token` flow. That integration has been removed in favor of a self hosted local solution for simplicity and performance in low connectivity environments.

---

## Languages

- Interface: English + Traditional Chinese (planned)
- Code: JavaScript (React, Node.js)

---

## Licensing

The current version does **not require any external SDK licensing**.  
_Archived Trimble Connect SDK code_ remains under the [Trimble Internal Use License](./LICENSE.trimble.txt) and must comply with Trimble's terms if reused.

---

## Status

**Actively in development** — Rebuilt from a legacy single page JS/CSS app into a modular, full stack architecture for local first deployment.
