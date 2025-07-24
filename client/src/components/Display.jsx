import { useState, useEffect } from "react";

import "../css/Display.css";

function Display() {
    const [projects, setProjects] = useState([]);

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
            <div className="project-display">
                <ul>
                    {/* Checks if project folders exist and add fallback to prevent crashes */}
                    {projects[0] ? (
                        <>
                            <li>{projects[0].project}</li>
                            {projects[0].files.slice(0,3).map((file, index) => (
                            <li key={index}>{file}</li>))}
                        </>
                    ) : (
                        <li>Project not found</li>
                    )}
                </ul>
            </div>
        </>
    );
}

export default Display;