import { useState, useEffect } from "react";

import "../css/Display.css";

function Display() {
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

    return (
        <>
            <div className="display">
                <h2>Currently uploaded files</h2>
            </div>
            <div className="project-display">
                <ul>
                    {/* Checks if project folders exist and add fallback to prevent crashes */}
                    {projects.length > 0 ? (
                        projects.map((project, i) => (
                            <li key={i}>
                                <strong>{project.project}</strong>
                                <ul>
                                    {(showAll[i] ? project.files : project.files.slice(0, 3)).map((file, index) => (
                                        <li key={index}>{file}</li>
                                    ))}
                                </ul>
                                <button onClick={() => setShowAll(prev => ({ ...prev, [i]: !prev[i] }))}>
                                    {showAll[i] ? "SHOW LESS" : "SHOW MORE"}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>Project not found</li>
                    )}
                </ul>
            </div>
        </>
    );
}

export default Display;