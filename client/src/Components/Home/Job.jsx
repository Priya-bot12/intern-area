import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./job.css"

function Job() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("Big Brands");
    const [jobData, setJobData] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://intern-area.onrender.com/api/job');
                setJobData(response.data);
            } catch (error) {
                console.error("Error fetching job data:", error);
            }
        };
        fetchData();
    }, []);

    const handleJob = (direction) => {
        if (!isMobile) {
            const container = document.getElementById("container3");
            if (!container) return;

            const step = 100;
            setCurrentSlide(prev => 
                direction === 'left' ? Math.max(prev - 1, 0) : Math.min(prev + 1, 3)
            );

            sideScrollJob(container, direction, 25, step, 10);
        }
    };

    const filterJobs = jobData.filter(item =>
        !selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    return (
        <>
            <ToastContainer />
            <section className="job-section mt-16 px-4">
                <div className="category-filter">
                    <span className='ml-6'>Popular Categories in Jobs:</span>
                    <div className="category-buttons ml-5">
                        {["Big Brands", "Work From Home", "Part-time", "MBA", "Engineering", "Media", "Design" ,"Data Science", "Market Research",
                            "Hospital Management", "EdTech","Legal and Law", "Hotel Management"
                        ].map((category) => (
                            <button
                            key={category}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap 
                                ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="job-listings">
                    {isMobile ? (
                        <div className="mobile-jobs">
                            {filterJobs.length > 0 ? (
                                filterJobs.map((data, index) => (
                                    <MobileJobCard key={index} data={data} />
                                ))
                            ) : (
                                <div className="no-jobs">
                                    <p>No jobs available in this category</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="desktop-jobs-container" id="container3">
                                <div className="desktop-jobs">
                                    {filterJobs.length > 0 ? (
                                        filterJobs.map((data, index) => (
                                            <DesktopJobCard key={index} data={data} />
                                        ))
                                    ) : (
                                        <div className="no-jobs">
                                            <p>No jobs available in this category</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button className='back' onClick={() => handleJob('left')}>
                                    <i className='bi bi-chevron-left' id='sideBack'></i>
                                </button>
                                <button className="next" onClick={() => handleJob('right')}>
                                    <i className='bi bi-chevron-right' id='slide'></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

// Reusable Job Card Components
const MobileJobCard = ({ data }) => (
    <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
        <JobCardContent data={data} />
    </div>
);

const DesktopJobCard = ({ data }) => (
    <div className="flex-none w-80 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
        <JobCardContent data={data} />
    </div>
);

const JobCardContent = ({ data }) => (
    <>
        <div className="flex items-center mb-4">
            <i className='bi bi-arrow-up-right text-blue-600 mr-2'></i>
            <span className="text-sm font-medium text-blue-600">Actively Hiring</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{data.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{data.company}</p>
        <hr className="mb-4" />
        <div className="space-y-2 text-sm">
            <div className="flex items-center">
                <i className="bi bi-geo-alt-fill text-gray-400 mr-2"></i>
                <span>{data.location}</span>
            </div>
            <div className="flex items-center">
                <i className="bi bi-cash-stack text-gray-400 mr-2"></i>
                <span>{data.CTC}</span>
            </div>
            <div className="flex items-center">
                <i className="bi bi-calendar-fill text-gray-400 mr-2"></i>
                <span>{data.Experience}</span>
            </div>
        </div>
        <div className="flex justify-between items-center mt-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-sm">
                Job
            </span>
            <Link
                to={`/detailjob?q=${data._id}`}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
                View details
                <i className="bi bi-chevron-right ml-1"></i>
            </Link>
        </div>
    </>
);

function sideScrollJob(element, direction, speed, distance, step) {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
        element.scrollLeft += direction === "left" ? -step : step;
        scrollAmount += step;
        if (scrollAmount >= distance) {
            clearInterval(slideTimer);
        }
    }, speed);
}

export default Job;
