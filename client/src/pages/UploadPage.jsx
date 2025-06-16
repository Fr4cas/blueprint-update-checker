import React, { useState } from 'react';

// css
import '../css/UploadPage.css'

// Components
import Footer from '../components/Footer';


function UploadPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [version, setVersion] = useState('');
    const [notes, setNotes] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('version', version);
        formData.append('notes', notes);

        try {
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.status === 'success') {
                alert(`Upload successful! File URL:\n${data.fileUrl}`);
                
            } else {
                alert('Upload failed.');
            }
        } catch (err) {
            console.error('Error uploading:', err);
            alert('An error occurred during upload.');
        }
    };

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
            </div>
            <div>
                <Footer />
            </div>
        </>

    );
}

export default UploadPage;