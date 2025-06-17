import React, { useState } from 'react';

// css
import '../css/UploadPage.css'

// Components
import Footer from '../components/Footer';

// =========================================================================================
// js section start

function UploadPage() {
    // States to hold information
    const [selectedFile, setSelectedFile] = useState(null);
    const [version, setVersion] = useState('');
    const [notes, setNotes] = useState('');

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
                alert(`Upload successful! File URL:\n${data.fileUrl}`);

            // Notify user of failed upload
            } else {
                alert('Upload failed.');
            }
        // Log and alert on error    
        } catch (err) {
            console.error('Error uploading:', err);
            alert('An error occurred during upload.');
        }
    };
    /* ====== Handle form submition - end ======= */

//  js section end
// =========================================================================================
//  html section start 

    return (
        <>
            <div className="upload-container">
                <h1> Upload a New Blueprint</h1>

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

                    <button type="submit" disabled={!selectedFile}>Upload Blueprint</button>
                </form>

                {selectedFile && (
                    <p className="upload-preview">Selected: {selectedFile.name}</p>
                )}

                <Footer />
            </div>
        </>

    );
}

// html section end
// =========================================================================================

export default UploadPage;