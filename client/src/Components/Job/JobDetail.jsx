import React, { useEffect, useState } from 'react'
import { selectUser } from '../../Feature/UserSlice'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from "sweetalert2";
import { BiX, BiCalendar, BiWallet, BiMap, BiTime } from 'react-icons/bi'

function JobDetail() {
  const user = useSelector(selectUser);
  const [resumeFile, setResumeFile] = useState(null);
  const [isDivVisible, setDivVisible] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const navigate = useNavigate();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("q");

  const [data, setData] = useState({});

  useEffect(() => {
    if (isDivVisible) {
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };
  }, [isDivVisible]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://intern-area.onrender.com/api/job/${id}`);
        const { company, category } = response.data;
        setCompany(company);
        setCategory(category);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching job data", error);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
     Swal.fire({
             icon: "error",
             title: "Oops...",
             text: "Please upload a pdf!",
           });
    }
  };

  const submitApplication = async () => {
    if (textarea.trim() === "") {
      Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please fill all the required fields!",
            });
      return;
    }

    const formData = new FormData();
    formData.append('coverLetter', textarea);
    formData.append('category', category);
    formData.append('company', company);
    formData.append('user', JSON.stringify(user));
    formData.append('Application', id);
    formData.append('availability', availability);
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      await axios.post("https://intern-area.onrender.com/api/application", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Application submitted Successfully",
            });
      navigate("/Jobs");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting the application");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <span className="bg-[#e3f2fd] text-[#1976d2] px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <i className="bi bi-arrow-up-right text-lg"></i> Actively Hiring
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold">{data.company}</h2>
          <p className="text-gray-600 flex items-center gap-2 mt-2">
            <BiMap className="text-lg" /> {data.location}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-4">
            <BiCalendar className="text-3xl text-blue-600" />
            <div>
              <label className="text-gray-500 text-sm">Start Date</label>
              <p className="font-medium">{data.StartDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <BiTime className="text-3xl text-blue-600" />
            <div>
              <label className="text-gray-500 text-sm">Experience</label>
              <p className="font-medium">{data.Experience}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <BiWallet className="text-3xl text-blue-600" />
            <div>
              <label className="text-gray-500 text-sm">Salary</label>
              <p className="font-medium">{data.CTC}</p>
            </div>
          </div>
        </div>

        <Section title={`About ${data.company}`} content={data.aboutCompany} />
        <Section title="About the Job" content={data.aboutJob} />
        <Section title="Who Can Apply" content={data.Whocanapply} />
        <Section title="Perks" content={data.perks} />
        <Section title="Additional Information" content={data.AdditionalInfo} />
        <div className="flex items-center">
            <span className="text-xl font-semibold mb-4">Open Positions:</span>
            <strong className="text-gray-600 leading-relaxed mb-3 ml-10">{data.numberOfOpening}</strong>
        </div>

        <button
          onClick={() => setDivVisible(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Now
        </button>
      </div>

      {isDivVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
          <button
              onClick={() => setDivVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-20"
            >
              <BiX className="text-2xl" />
            </button>

            <div className="space-y-6">
            <h2 className="text-2xl font-bold">Apply for {data.company}</h2>
              <div>
                <h3 className="font-medium mb-2">Your Resume</h3>
                <h4 className="text-gray-600 text-sm">Your current resume will be submitted with this application.</h4>
              </div>

              <div>
                <h3 className="font-medium mb-2">Cover Letter</h3>
                <textarea
                  value={textarea}
                  onChange={(e) => setTextarea(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Why should we hire you? (Required)"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="space-y-2">
                  {["Yes, I am available to join immediately",
                    "No, I am currently on notice period",
                    "No, I will have to serve notice period",
                    "Other"].map((option) => (
                      <label key={option} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="availability"
                          value={option}
                          checked={availability === option}
                          onChange={(e) => setAvailability(e.target.value)}
                          className="h-4 w-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                </div>
              </div>

              <div>
              <h3 className="font-medium mb-2">Custom Resume <span className="text-gray-600 text-sm">(Optional)</span></h3>
                <h4 className="text-gray-600 text-sm mb-3">Employer can download and view this resume.</h4>
                <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Choose PDF File
                </label>
                {resumeFile && (
                  <span className="ml-3 text-gray-600">{resumeFile.name}</span>
                )}
              </div>

              <div className="border-t pt-4">
                {user ? (
                  <button
                    onClick={submitApplication}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center hover:bg-blue-700"
                  >
                    Register to Apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Section = ({ title, content }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{content}</p>
  </div>
);

export default JobDetail;
