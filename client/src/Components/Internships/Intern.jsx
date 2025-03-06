import React, { useEffect, useState } from 'react';
import "./intern.css";
import compLogo from "../../Assests/netflix.png";
import axios from 'axios';
import { Link } from 'react-router-dom';

function Intern() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [minStipend, setMinStipend] = useState(0);
  const [maxStipend, setMaxStipend] = useState(100000);
  const [filterInternship, setFilterInternship] = useState([]);
  const [internData, setInternData] = useState([]);
  const [isDivVisible, setDivVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/internship');
        setInternData(response.data);
        setFilterInternship(response.data);
        // Calculate max stipend from data
        const max = Math.max(...response.data.map(item => convertStipend(item.stipend).min));
        setMaxStipend(max || 100000);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const convertStipend = (stipend) => {
    if (!stipend) return { min: 0, max: 0 };
    const clean = stipend.replace(/[^0-9-]/g, '');
    const parts = clean.split('-').map(Number);
    return {
      min: parts[0] || 0,
      max: parts[1] || parts[0] || 0
    };
  };

  const clearAllFilters = () => {
    setSearchTitle("");
    setSearchLocation("");
    setSelectedDuration("");
    setMinStipend(0);
  };

  useEffect(() => {
    const filterInternships = () => {
      const filteredData = internData.filter(internship => {
        const stipend = convertStipend(internship.stipend);
        return (
          internship.title.toLowerCase().includes(searchTitle) &&
          internship.location.toLowerCase().includes(searchLocation) &&
          (selectedDuration ? internship.duration === selectedDuration : true) &&
          stipend.min >= minStipend
        );
      });
      setFilterInternship(filteredData);
    };
    filterInternships();
  }, [searchTitle, searchLocation, selectedDuration, minStipend, internData]);

  return (

    <div className='intern-container'>
      <button
        className="filter-toggle"
        onClick={() => setDivVisible(!isDivVisible)}
      >
        <i className="bi bi-funnel"></i>
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
          <label>Internship Title</label>
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value.toLowerCase())}
            placeholder="Search title..."
          />
        </div>

        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value.toLowerCase())}
            placeholder="Search location..."
          />
        </div>

        <div className="filter-group">
          <label>Minimum Stipend (₹{minStipend.toLocaleString()})</label>
          <div className="stipend-range">
            <input
              type="range"
              min="0"
              max={maxStipend}
              step="1000"
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
            />
            <div className="range-values">
              <span>₹0</span>
              <span>₹{maxStipend.toLocaleString()}+</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label>Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="duration-select"
          >
            <option value="">Any Duration</option>
            <option value="1 month">1 Month</option>
            <option value="2 months">2 Months</option>
            <option value="3 months">3 Months</option>
            <option value="6 months">6 Months</option>
            <option value="1 year">1 Year</option>
          </select>
        </div>
      </div>

      <div className="internships-grid">
        <div className="results-count">
          {filterInternship.length} internships found
          <button className="filter-toggle" onClick={() => setDivVisible(!isDivVisible)}>
            <i className="bi bi-funnel"></i>
          </button>
        </div>

        {filterInternship.map((data) => {
          const stipend = convertStipend(data.stipend);
          return (
            <div className="internship-card" key={data._id}>
              <div className="card-header">
                <span className="bg-[#e3f2fd] text-[#1976d2] px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  <i className="bi bi-arrow-up-right text-lg"></i> Actively Hiring
                </span>
                <img src={data.logo ? `http://localhost:5000/${data.logo}` : compLogo} alt="Company logo" className="company-logo" />
              </div>
              <div className="card-body">
                <h3 className="internship-title">{data.title}</h3>
                <p className="company-name">{data.company}</p>
                <p className="internship-location">{data.location}</p>

                <div className="details-grid">
                  <div className="detail-item">
                    <i className="bi bi-play-circle-fill"></i>
                    <div>
                      <span>Start Date</span>
                      <p>{data.StartDate}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-calendar-check-fill"></i>
                    <div>
                      <span>Duration</span>
                      <p>{data.duration}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="bi bi-cash"></i>
                    <div>
                      <span>Stipend</span>
                      <p>
                        {stipend.min === stipend.max
                          ? `₹${stipend.min.toLocaleString()}/month`
                          : `₹${stipend.min.toLocaleString()} - ₹${stipend.max.toLocaleString()}/month`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <span className="internship-type">Internship</span>
                <Link to={`/detailInternship?q=${data._id}`} className="view-details">
                  View Details <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Intern;