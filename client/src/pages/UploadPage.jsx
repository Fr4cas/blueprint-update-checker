import React, { useState } from 'react';

// assets
import UploadIcon from "../assets/upload.svg";

// css
import '../css/UploadPage.css'

// components
import Footer from '../components/Footer';

// =========================================================================================
// js section start

function UploadPage() {

    // States to hold information
    const [selectedFile, setSelectedFile] = useState(null);
    const [version, setVersion] = useState('');
    const [notes, setNotes] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    // Called when user selects a file
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    /* ====== Handle form submition - start ====== */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page from reloading on form submit

        // Prepare form data to send to backend
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('version', version);
        formData.append('notes', notes);

        try {
            // Send form data to backend upload endpoint
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            // Notify user of successful upload
            if (data.status === 'success') {
                setStatusType('success');
                setStatusMessage('Upload Successful!');
                setDownloadUrl(data.fileUrl);

                // Notify user of failed upload
            } else {
                setStatusType('error');
                setStatusMessage('Upload Failed. Make sure file is a PDF.')
            }
            // Log and alert on error    
        } catch (err) {
            setStatusType('error');
            setStatusMessage('Error During Upload. Make sure file is a PDF.');
        }
    };
    /* ====== Handle form submition - end ======= */

    //  js section end
    // =========================================================================================
    //  html section start 

    return (
        <>
            <div className="upload-container">
                <h1> Attach QR Code </h1>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div>
                        <label>Choose PDF:</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label>Version:</label>
                        <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} />
                    </div>

                    <div>
                        <label>Update Notes:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>

                    <button type="submit" disabled={!selectedFile}>
                        <img src={UploadIcon} alt="Upload icon" className="icon" />
                        Upload Blueprint
                    </button>
                </form>

                <div className="after-form">
                    {downloadUrl && (
                        <a href={downloadUrl} download className="download-button">
                            Download
                        </a>
                    )}

                    {statusMessage && (
                        <div className={`upload-status ${statusType}`}>
                            {statusMessage}
                        </div>
                    )}

                    {selectedFile && (
                        <p className="upload-preview">Uploaded: {selectedFile.name}</p>
                    )}
                </div>

                <Footer />
            </div>
        </>

    );

}

// html section end
// =========================================================================================

export default UploadPage;