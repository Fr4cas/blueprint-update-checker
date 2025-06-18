import React, { useEffect, useRef, useState } from "react";

// css
import '../css/ScanPage.css';

// Components
import Footer from "../components/Footer";

// Libraries
import { Html5Qrcode } from 'html5-qrcode';

// =========================================================================================
// Js section start

function ScanPage() {

    // state and ref initialization
    const scannerRef = useRef(null); // point to html where scanner will render
    const html5QrcodeScanner = useRef(null); // hold instance of scanner
    const [scanResult, setScanResult] = useState(null); // store text (URL from QR code)
    const [scanError, setScanError] = useState('');  // errors

    useEffect(() => {

        /* ====== Handle camera devices - start ====== */
        const scannerId = scannerRef.current?.id || "qr-scanner";
        html5QrcodeScanner.current = new Html5Qrcode(scannerId); // Create scanner instance

        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    html5QrcodeScanner.current.start(
                        devices[0].id,
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                        },
                        (decodedText) => {
                            setScanResult(decodedText); // Save result
                            html5QrcodeScanner.current.stop().then(() => {
                                console.log("Scanner stopped.");
                            }).catch((err) => {
                                console.warn("Stop failed:", err);
                            });
                        },
                        (errorMessage) => {
                            setScanError("Unable to detect QR code. Please try again..."); 
                        }
                    );
                } else {
                    setScanError("No camera found."); // If no camera is available
                }
            })
            .catch((err) => {
                console.error("Camera access error:", err);
                setScanError("Failed to access camera.");
            });

        // Cleanup on unmount
        return () => {
            if (html5QrcodeScanner.current && html5QrcodeScanner.current._isScanning) {
                html5QrcodeScanner.current
                    .stop()
                    .then(() => html5QrcodeScanner.current.clear())
                    .catch((err) => console.warn("Cleanup error:", err));
            }
        };
        /* ====== Handle camera devices - end ====== */

    }, []);

    // Js section end
    // =========================================================================================
    //  html section start 

    return (
        <>
            <div className="scan-container">
                <h1>Scan QR Code</h1>
                <p>Check Version</p>

                {!scanResult ? (
                    <>
                        <div id="qr-scanner" ref={scannerRef} className="scanner-box" />
                        {scanError && <p className="scan-error">{scanError}</p>}
                    </>
                ) : (
                    <div className="scan-result">
                        <p>QR Code Scanned:</p>
                        <a href={scanResult} target="_blank" rel="noopener noreferrer">
                            {scanResult}
                        </a>
                    </div>
                )}

                <Footer />
            </div>
        </>
    );

}

// html section end
// =========================================================================================

export default ScanPage;