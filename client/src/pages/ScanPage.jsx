// import react from "react";

// css
import '../css/ScanPage.css';

// Components
import Footer from "../components/Footer";

// =========================================================================================
//  html section start 

function ScanPage() {

    return (
        <>
            <div className="scan-container">
                <h1>Scan Blueprint QR Code</h1>
                <p>Use your camera to scan the QR code on the blueprint.</p>

                <div className="scanner-box">
                    <p>Scanner will be here</p>
                </div>

                <Footer />
            </div>

        </>
    );
}

export default ScanPage;