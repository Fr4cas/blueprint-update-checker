import React, { useEffect, useState } from 'react';

// assets
import UploadIcon from "../assets/upload.svg";

// css
import '../css/UploadPage.css'

// components
import Footer from '../components/Footer';

// =========================================================================================
// Js section start

function UploadPage() {

    // States
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.status === 'success') {
                setStatusType('success');
                setStatusMessage('Upload Successful!');
                setDownloadUrl(data.fileUrl);
            } else {
                setStatusType('error');
                setStatusMessage(data.message || 'Upload Failed. Make sure file is a PDF.');
            }
        } catch (err) {
            setStatusType('error');
            setStatusMessage('Error During Upload. Make sure file is a PDF.');
        }
    };

    // Js section end
    // =========================================================================================
    //  html section start 

    return (
        <>
            <div className="upload-container">
                <h1>Attach QR Code</h1>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div>
                        <label>Choose Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <label>Choose PDF:</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />
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
                        <p className="upload-preview">Selected: {selectedFile.name}</p>
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