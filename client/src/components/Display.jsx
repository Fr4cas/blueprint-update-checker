import { useState, useEffect } from "react";

function Display() {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        
    })

    return (
        <>
        <div className="project-display">
            <ul>
                <li>this is where the files will display</li>
            </ul>
        </div>
        </>
    );
}

export default Display;