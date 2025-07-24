import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Html5Qrcode } from 'html5-qrcode';

import '../css/ScanPage.css';

import Footer from "../components/Footer";

// =========================================================================================
// Js section start

function ScanPage() {
    const { t } = useTranslation('scan')

    // state and ref initialization
    const scannerRef = useRef(null); // point to html where scanner will render
    const html5QrcodeScanner = useRef(null); // hold instance of scanner
    const [scanResult, setScanResult] = useState(null); // store text (URL from QR code)
    const [scanError, setScanError] = useState('');  // errors
    const [compareResult, setCompareResult] = useState(null);

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

                            // Stop scanner
                            html5QrcodeScanner.current.stop()
                                .then(() => {
                                    console.log("Scanner stopped.");
                                })
                                .catch((err) => {
                                    console.warn("Stop failed:", err);
                                });

                            // Parse project and scanned file from scannedText
                            const parts = decodedText.split('/');
                            const project = parts[2]; // assuming: uploads/projects/project1/file.pdf
                            const scannedFile = parts.slice(3).join('/');

                            fetch('http://localhost:5000/compare', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ project, scannedFile }),
                            })
                                .then(res => res.json())
                                .then(data => {
                                    console.log('Compare result:', data);
                                    setCompareResult(data);
                                    setScanError('');
                                })
                                .catch((err) => {
                                    console.error("Compare error:", err);
                                    setScanError("Failed to validate file version.");
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

    const simulateScan = () => {
        const mockText = 'uploads/projects/project1/20250624_145030_blueprint1.pdf';

        setScanResult(mockText);

        const parts = mockText.split('/');
        const project = parts[2];
        const scannedFile = parts.slice(3).join('/');

        fetch('http://localhost:5000/compare', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project, scannedFile }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Simulated compare result:', data);
                setCompareResult(data);
                setScanError('');
            })
            .catch((err) => {
                console.error("Simulation error:", err);
                setScanError("Simulated check failed.");
            });
    };

    return (
        <>
            <div className="scan-container">
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>

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

                {compareResult && (
                    <div className="compare-result">
                        {compareResult.isLatest ? (
                            <p className="success">{t('latest')}</p>
                        ) : (
                            <p className="warning">
                                {t('notLatest')} {compareResult.latestTimestamp}
                            </p>
                        )}
                    </div>
                )}

                <button onClick={simulateScan} className="test-button">
                    Simulate QR Scan
                </button>

                <Footer />
            </div>
        </>
    );
}

// html section end
// =========================================================================================

export default ScanPage;