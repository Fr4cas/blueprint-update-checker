import { useState, useEffect } from "react";

import "../css/Display.css";

function Display() {
    const [projects, setProjects] = useState([]);
    const [showAll, setShowAll] = useState(false);

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
                                    {project.files.slice(0, 3).map((file, index) => (
                                        <li key={index}>{file}</li>
                                    ))}
                                </ul>
                            </li>
                        ))
                        // <>
                        //     {/* <li>{projects[0].project}</li>
                        //     {(showAll ? projects[0].files : projects[0].files.slice(0, 3)).map((file, index) => (
                        //         <li key={index}>{file}</li>))} */}
                        //     <button onClick={() => setShowAll(!showAll)}>
                        //         {showAll ? "SHOW LESS" : "SHOW MORE"}
                        //     </button>
                        // </>
                    ) : (
                        <li>Project not found</li>
                    )}
                </ul>
            </div>
        </>
    );
}

export default Display;