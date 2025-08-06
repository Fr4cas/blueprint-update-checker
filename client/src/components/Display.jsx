import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import "../css/Display.css";

const IP_URL = process.env.REACT_APP_IP_URL;

function Display() {
    const { t } = useTranslation('common');
    const [projects, setProjects] = useState([]);
    const [showAll, setShowAll] = useState({});

    useEffect(() => {
        fetch("/display")
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setProjects(data.projects);
                } else {
                    console.error("Error fetching projects:", data.message);
                }
            })
            .catch((err) => console.error("Fetch failed:", err));
    }, []);

    function groupFiles(files) {
        const groups = {};

        // for each file check the name using regex
        files.forEach(file => {
            const match = file.match(/^(\d{8}_\d{6})_(.+)$/);
            const timestamp = match ? match[1] : null;
            const base = match ? match[2] : file;

            // if base name doesn't exist create new array to object using its name
            if (!groups[base]) {
                groups[base] = {
                    files: [],
                    current: null,
                    latest: null
                };
            }
            // else add file to group count
            groups[base].files.push(file);

            if (timestamp) {
                const newer = !groups[base].latest || timestamp > groups[base].latest;
                if (newer) {
                    groups[base].current = file;
                    groups[base].latest = timestamp;
                }
            }
        });
        return groups;
    }

    return (
        <>
            <div className="display">
                <h2>{t('display')}</h2>
            </div>
            <div className="project-display">
                <ul>
                    {/* Checks if project folders exist and add fallback to prevent crashes */}
                    {projects.length > 0 ? (
                        projects.map((project, i) => (
                            <li key={i}>
                                {/* maps out projects */}
                                <strong>{project.project}</strong>
                                {/* maps out file groups and only displays first 3 initially */}
                                <ul>
                                    {(() => {
                                        const grouped = groupFiles(project.files);
                                        const entries = Object.entries(grouped);
                                        const visibleEntries = showAll[i] ? entries : entries.slice(0, 3);

                                        return visibleEntries.map(([base, group], index) => (
                                            <li key={index}>
                                                <div>{base} - <strong>{group.files.length} version(s)</strong></div>
                                                <ul>
                                                    <li>
                                                        <a href={`${IP_URL}/${project.project}/${group.current}`} download>
                                                            {group.current}
                                                        </a>
                                                        <strong> (latest)</strong>
                                                    </li>
                                                </ul>
                                            </li>

                                        ));
                                    })()}
                                </ul>
                                {/* button to toggle more or less files */}
                                <button onClick={() => setShowAll(prev => ({ ...prev, [i]: !prev[i] }))}>
                                    {showAll[i] ? t('button.less') : t('button.more')}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>{t('noProject')}</li>
                    )}
                </ul>
            </div>
        </>
    );
}

export default Display;