import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import UploadIcon from "../assets/upload.svg";

import '../css/UploadPage.css'

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

    const { t } = useTranslation('upload');

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
                <h1>{t('title')}</h1>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div>
                        <label>{t('form.projectLabel')}</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            required
                        >
                            <option value="">{t('form.selectPlaceholder')}</option>
                            <option value="__new__">{t('form.newProjectOption')}</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        {selectedProject === '__new__' && (
                            <input
                                type="text"
                                className="new-project-input"
                                placeholder={t('form.newProjectPlaceholder')}
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                required
                            />
                        )}

                        <label>{t('form.fileLabel')}</label>
                        <input type="file" accept=".pdf,.dwg,application/pdf,application/acad,application/x-acad,application/dwg,application/x-dwg,image/vnd.dwg" onChange={handleFileChange} multiple />
                    </div>

                    <button type="submit" disabled={selectedFiles.length === 0}>
                        <img src={UploadIcon} alt="Upload icon" className="icon" />
                        {t('form.submit')}
                    </button>
                </form>

                <div className="after-form">
                    {downloadUrl && (
                        <a href={downloadUrl} download className="download-button">
                            {t('after.download')}
                        </a>
                    )}

                    {statusMessage && (
                        <div className={`upload-status ${statusType}`}>
                            {t(`status.${statusType}`)}
                        </div>
                    )}

                    {selectedFiles.length > 0 && (
                        <div className="upload-preview">
                            <p>{t('after.selected')}</p>
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div id='footer'>
                <Footer />
            </div>
        </>
    );
}

// html section end
// =========================================================================================

export default UploadPage;
