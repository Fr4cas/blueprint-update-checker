import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import "../css/Display.css";

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
            const base = match ? match[2] : file;

            // if base name doesn't exist create new array to object using its name
            if (!groups[base]) {
                groups[base] = [];
            }
            // else add file to group count
            groups[base].push(file);
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

                                        return visibleEntries.map(([base, files], index) => (
                                            <li key={index}>
                                                {base} - <strong>{files.length} version(s)</strong>
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