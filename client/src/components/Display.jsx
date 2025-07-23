import { useState, useEffect } from "react";

function Display() {
    const [projects, setProjects] = useState([])

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
                    <li>{projects[0]?.project || "Project not found"}</li>
                    {projects[0]?.files.map((file, index) => (
                        <li key={index}>{file}</li>
                    ))};
                </ul>
            </div>
        </>
    );
}

export default Display;