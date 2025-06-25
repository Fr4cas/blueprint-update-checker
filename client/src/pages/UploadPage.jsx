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
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    // Handle file selection
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        // Prevent duplicate file names
        const fileMap = new Map();
        [...selectedFiles, ...newFiles].forEach(file => {
            fileMap.set(file.name, file);
        });

        setSelectedFiles(Array.from(fileMap.values()));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // New project upload (folder + file)
        const projectToSubmit = selectedProject === '__new__' ? newProjectName.trim() : selectedProject;

        if (!projectToSubmit) {
            setStatusType('error');
            setStatusMessage('Please select or enter a project name.');
            return;
        }

        // Single file upload
        const formData = new FormData();
        formData.append('project', projectToSubmit);
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });


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
                setSelectedFiles([]);
            } else {
                setStatusType('error');
                setStatusMessage(data.message || 'Upload Failed. Make sure file is a PDF.');
            }
        } catch (err) {
            setStatusType('error');
            setStatusMessage('Error During Upload. Make sure file is a PDF.');
        }
    };

    // Fetch project folders
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:5000/projects');
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.error('Failed to load projects:', err);
            }
        };

        fetchProjects();
    }, []);

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
                            <option value="__new__">New Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        {selectedProject === '__new__' && (
                            <input
                                type="text"
                                className="new-project-input"
                                placeholder="Enter new project name"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                required
                            />
                        )}

                        <label>Choose PDF:</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} multiple />
                    </div>

                    <button type="submit" disabled={selectedFiles.length === 0}>
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

                    {selectedFiles.length > 0 && (
                        <div className="upload-preview">
                            <p>Selected:</p>
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
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
