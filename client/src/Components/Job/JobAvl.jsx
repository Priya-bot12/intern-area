import React, { useEffect, useState } from 'react';
import "./jobAvl.css";
import compLogo from "../../Assests/netflix.png";
import axios from 'axios';
import { Link } from 'react-router-dom';

function JobAvl() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [partTime, setPartTime] = useState(false);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isDivVisible, setDivVisible] = useState(false);
  const [maxSalary, setMaxSalary] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://intern-area.onrender.com/api/job');
        setJobData(response.data);
        setFilteredJobs(response.data);

        // Calculate maximum salary from data
        const salaries = response.data.map(job => {
          const salary = job.CTC ? parseInt(job.CTC.split(' ')[0]) : 0;
          return isNaN(salary) ? 0 : salary;
        });
        setMaxSalary(Math.max(...salaries, 100));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const clearAllFilters = () => {
    setSearchTitle("");
    setSearchLocation("");
    setPartTime(false);
    setWorkFromHome(false);
    setMinSalary(0);
    setMinExperience(0);
  };

  useEffect(() => {
    const filterJobs = () => {
      let filtered = jobData.filter(job => {
        // Title filter
        const matchesTitle = searchTitle
          ? (job.title?.toLowerCase().includes(searchTitle.toLowerCase()) ?? false)
          : true;

        // Location filter
        const matchesLocation = searchLocation
          ? (job.location?.toLowerCase().includes(searchLocation.toLowerCase()) ?? false)
          : true;

        // Category filters
        const jobCategory = job.category?.toLowerCase() || '';
        const matchesPartTime = partTime ? jobCategory.includes('part') : true;
        const matchesWFH = workFromHome ? jobCategory.includes('work from home') : true;

        // Salary parsing
        const salaryValue = job.CTC?.match(/\d+/)?.[0] || 0;
        const jobSalary = parseInt(salaryValue, 10) || 0;
        const matchesSalary = jobSalary >= minSalary;

        // Experience parsing
        const experienceValue = job.Experience?.match(/\d+/)?.[0] || 0;
        const jobExperience = parseInt(experienceValue, 10) || 0;
        const matchesExperience = jobExperience >= minExperience;

        return matchesTitle &&
          matchesLocation &&
          matchesPartTime &&
          matchesWFH &&
          matchesSalary &&
          matchesExperience;
      });

      setFilteredJobs(filtered);
    };

    filterJobs();
  }, [searchTitle, searchLocation, partTime, workFromHome, minSalary, minExperience, jobData]);



  return (
    <div className='job-container'>
      <button
        className="filter-toggle flex items-center justify-center"
        onClick={() => setDivVisible(!isDivVisible)}
      >
        <i className="bi bi-funnel text-xl"></i>
      </button>


      <div className={`filter-sidebar ${isDivVisible ? 'visible' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <div className="filter-controls">
            <button className="clear-all" onClick={clearAllFilters}>
              Clear All
            </button>
            <button className="close-btn" onClick={() => setDivVisible(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Job Title</label>
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search job title..."
          />
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search location..."
          />
        </div>

        <div className="filter-group">
          <label>Job Type</label>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={partTime}
              onChange={(e) => setPartTime(e.target.checked)}
              id="partTime"
            />
            <label htmlFor="partTime">Part Time</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={workFromHome}
              onChange={(e) => setWorkFromHome(e.target.checked)}
              id="wfh"
            />
            <label htmlFor="wfh">Work From Home</label>
          </div>
        </div>


        <div className="filter-group">
          <label>Minimum Annual Salary (LPA)</label>
          <div className="salary-range">
            <input
              type="range"
              min="0"
              max={maxSalary}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
            />
            <div className="range-values">
              <span>0 LPA</span>
              <span>{maxSalary}+ LPA</span>
            </div>
            <div className="current-value">
              Selected: {minSalary} LPA
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label>Minimum Experience (years)</label>
          <div className="salary-range">
            <input
              type="range"
              min="0"
              max="20"
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
            />
            <div className="range-values">
              <span>0</span>
              <span>20+</span>
            </div>
            <div className="current-value">
              Selected: {minExperience}+ years
            </div>
          </div>
        </div>
      </div>

      <div className="jobs-grid">
        <div className="results-count">
          {filteredJobs.length} jobs found
        </div>

        {filteredJobs.map((job) => (
          <div className="job-card" key={job._id}>
            <div className="card-header">
              <span className="bg-[#e3f2fd] text-[#1976d2] px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <i className="bi bi-arrow-up-right text-lg"></i> Actively Hiring
              </span>
              <img
                src={job.logo ? `http://localhost:5000/${job.logo}` : compLogo}
                alt="Company logo"
                className="company-logo"
              />
            </div>
            <div className="card-body">
              <h3 className="text-xl text-gray-800 mb-2">{job.title}</h3>
              <p className="company-name">{job.company}</p>
              <p className="job-location">{job.location}</p>

              <div className="details-grid">
                <div className="detail-item">
                  <i className="bi bi-play-circle-fill"></i>
                  <div>
                    <span>Start Date</span>
                    <p>{new Date(job.StartDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="bi bi-person-badge"></i>
                  <div>
                    <span>Experience</span>
                    <p>{job.Experience}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="bi bi-cash"></i>
                  <div>
                    <span>CTC</span>
                    <p>{job.CTC}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <span className="job-type">Job</span>
              <Link to={`/detailjob?q=${job._id}`} className="view-details">
                View Details <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobAvl;
