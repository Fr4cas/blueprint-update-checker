# Blueprint QR Viewer

A lightweight web app that ensures construction workers always access the **latest blueprint version** using a **QR code**. Designed for clarity, speed, and ease of use on-site.

---

##  Features

-  **QR Code Generator**: Generates a QR code that links to the latest blueprint.
-  **Version Tracking**: Displays blueprint version, update date, and notes.
-  **Project Selector**: Workers can select which construction project they are working on.
-  **Simple Web Interface**: Optimized for tablets or on-site access.

---

##  Folder Structure

```
project-root/
│
├── index.html             # Main entry point of the web app
│
├── css/
│   └── styles.css         # Styles for layout and UI
│
├── js/
│   └── main.js            # JavaScript logic for fetching data and generating QR codes
│
├── lib/
│   └── qrcode.min.js      # QR code library (https://davidshimjs.github.io/qrcodejs/)
│
├── test/
│   └── trimble.api.json   # Mock Trimble Connect API data (local JSON file)
│
└── README.md              # Project documentation (this file)
```

---

##  How to Use

1. Open `index.html` in any modern browser (no server needed for local testing).
2. Select a project from the dropdown.
3. View blueprint info and scan the QR code.
4. Click the link to view the blueprint online (or embed it in future updates).

---

##  Next Steps

- Embed blueprint viewer (PDF.js)
- Fetch real blueprint data from Trimble API
- Add support for version comparison
- Add offline cache support for remote sites

---

##  Languages

- Interface: English + Traditional Chinese  
- Code: HTML, CSS, JavaScript

---

##  Status

**In development** — Trimble API access pending. Mock data currently used.
