# Blueprint QR Viewer

A lightweight web app that ensures construction workers always access the **latest blueprint version** using a **QR code**. Designed for clarity, speed, and ease of use on-site.

---

## Features

- **QR Code Generator**: Automatically generates a QR code linking to the uploaded blueprint (PDF), and embeds it directly into the PDF file.
- **Version Comparison**: Workers can scan a QR code from any printed blueprint and verify if it's the **latest version** stored on the system.
- **Project-Based Organization**: Uploads are organized into individual project folders with automatic version handling.
- **Multiple File Upload Support**: Upload several blueprints in one batch; the system handles versioning automatically.
- **QR Scanner Interface**: Simple UI for scanning printed QR codes to validate blueprint versions.
- **Project Selection UI**: Users can select from existing projects or create a new one during upload.
- **Simple Web Interface**: Optimized for desktop, tablet, and on site mobile use.
- **Multilingual Support**: Interface supports both **English** and **Traditional Chinese**.
- **Local File Management**: Operates without reliance on third party APIs for file handling or version control.

---

## Tech Stack

- **Frontend**:
  - React
  - i18next
  - HTML5 QR Scanner
  - QR Code Generator
- **Backend**: 
  - Node.js + Express (core server framework)
  - Multer (file upload handling)
  - CORS (cross-origin request support)
  - dotenv (environment variable config)
  - node-fetch (Trimble API requests via OAuth)
  - pdf-lib (PDF QR code embedding)
  - qrcode (generate QR image from link)
- **Storage**: Local file system (organized by project folders)
- **Authentication**: _None required_ (no longer dependent on OAuth services)

---

## Deprecated: Trimble Connect Integration

This project **previously used the Trimble Connect API** for blueprint storage and access via OAuth tokens and `refresh_token` flow. That integration has been removed in favor of a self hosted local solution for simplicity and performance in low connectivity environments.

---

## Languages

- Interface: English + Traditional Chinese
- Code: JavaScript (React, Node.js)

---

## Licensing

The current version does **not require any external SDK licensing**.  
_Archived Trimble Connect SDK code_ remains under the [Trimble Internal Use License](./LICENSE.trimble.txt) and must comply with Trimble's terms if reused.

---

## Status

**Actively in development** — Rebuilt from a legacy single page JS/CSS app into a modular, full stack architecture for local first deployment.
