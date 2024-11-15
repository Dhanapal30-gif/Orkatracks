import React, { useEffect, useState } from 'react';
import './Projects.css';

const Projects = () => {
    const [getProject, setGetProject] = useState([]);
    const [onGoing, setOnGoing] = useState([]);
    const [notStarted, setNotStarted] = useState([]);
    const [completed, setCompleted] = useState([]);

    const [onGoingSlide, setOnGoingSlide] = useState(0);
    const [notStartedSlide, setNotStartedSlide] = useState(0);
    const [completedSlide, setCompletedSlide] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://backend-uyuy.onrender.com/api/projectController/getProject');
                const data = await response.json();
                setGetProject(data);

                // Separate projects by status
                setOnGoing(data.filter(project => project.status === 'ongoing'));
                setNotStarted(data.filter(project => project.status === 'not started'));
                setCompleted(data.filter(project => project.status === 'completed'));
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing': return '#4caf50'; // Green
            case 'completed': return '#2196f3'; // Blue
            case 'not started': return '#ff9800'; // Orange
            default: return '#9e9e9e'; // Grey
        }
    };

    // Set up intervals for each category
    useEffect(() => {
        const onGoingInterval = setInterval(() => {
            setOnGoingSlide((prev) => (prev + 1) % Math.ceil(onGoing.length / 2));
        }, 3000);

        const notStartedInterval = setInterval(() => {
            setNotStartedSlide((prev) => (prev + 1) % Math.ceil(notStarted.length / 2));
        }, 3000);

        const completedInterval = setInterval(() => {
            setCompletedSlide((prev) => (prev + 1) % Math.ceil(completed.length / 2));
        }, 3000);

        return () => {
            clearInterval(onGoingInterval);
            clearInterval(notStartedInterval);
            clearInterval(completedInterval);
        };
    }, [onGoing.length, notStarted.length, completed.length]);

    // Create slides for each category
    const createSlides = (projects) => {
        const slides = [];
        for (let i = 0; i < projects.length; i += 2) {
            slides.push(projects.slice(i, i + 2));
        }
        return slides;
    };

    return (
        <div>
            <h6 style={{ marginTop: '7px', marginLeft: '19px', width: '290px' }}>Projects</h6>

            <div className='getproject'>
                    <div className="status-section">
                        <h5 className='alignment'>Ongoing ({onGoing.length})</h5>
                        {createSlides(onGoing)[onGoingSlide]?.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    backgroundColor: getStatusColor(project.status),
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    marginTop: '10px',
                                    width: '70%',
                                    marginBottom: '10px',
                                }}
                            >
                                <h5 className="gradient-text">{project.projectNo}</h5>
                                <p>Status: {project.status}</p>
                                <p>Description: {project.description}</p>
                            </div>
                        ))}
                    </div>
            </div>

            <div className='getproject1'>
                <div className="status-section">
                    <h5 className='alignment'>Completed ({completed.length})</h5>
                    {createSlides(completed)[completedSlide]?.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                backgroundColor: getStatusColor(project.status),
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '10px',
                                width: '70%',
                                marginBottom: '10px',
                            }}
                        >
                            <h5 className="gradient-text">{project.projectNo}</h5>
                            <p>Status: {project.status}</p>
                            <p>Start Date: {project.startDate}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='getproject2'>
                <div className="status-section">
                    <h5 className='alignment'>Not Started ({notStarted.length})</h5>
                    {createSlides(notStarted)[notStartedSlide]?.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                backgroundColor: getStatusColor(project.status),
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '10px',
                                marginTop: '10px',
                                width: '70%',
                                marginBottom: '10px',
                            }}
                        >
                            <h5 className="gradient-text">{project.projectNo}</h5>
                            <p>Status: {project.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
       
    );
};

export default Projects;
