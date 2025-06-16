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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', {
            file: selectedFile,
            version,
            notes,
        });

        // TODO: Hook up to backend later
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