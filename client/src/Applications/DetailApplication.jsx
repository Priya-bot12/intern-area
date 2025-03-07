import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import profilePhoto from '../Assests/profilePhoto.jpg';
import ResumePDF from '../profile/ResumePDF';

function DetailApplication() {
  const [resumeData, setResumeData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("a");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://intern-area.onrender.com/api/application/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching application data:", error);
        alert("Error loading application details");
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await axios.get(`https://intern-area.onrender.com/api/application/${id}`);
        setData(response.data);
  
        if (!response.data?.user) {
          console.warn("User object is missing in application data");
          return;
        }
  
        // Fetch all users from Firebase and match by email (if possible)
        const usersSnapshot = await getDocs(collection(db, "users"));
        let matchedUser = null;
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === response.data.user.email) {  // Matching by email
            matchedUser = userData;
          }
        });
  
        if (matchedUser) {
          setUserData(matchedUser);
          setResumeData(matchedUser.resume);
        } else {
          console.warn("No matching user found in Firebase");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading application details");
      }
    };
  
    fetchApplicationData();
  }, [id]);
  

  const handleStatusUpdate = async (id, action) => {
    try {
      const response = await axios.put(`https://intern-area.onrender.com/api/application/${id}`, { action });
      setData(response.data.data);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  if (!data) {
    return <div className="p-8 text-center text-gray-600">Loading application details...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="w-full md:w-1/3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center text-center md:text-left">
            {/* Profile Image */}
            <img
              alt="Applicant"
              className="w-full sm:h-48 md:h-64 lg:h-80 object-cover rounded-lg"
              src={profilePhoto || "/placeholder.jpg"}
            />

            {/* Applicant Info */}
            <div className="mt-4 space-y-2 w-full">
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                {data?.user?.fullName || "Applicant"}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                Applied on: {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>


          {/* Content Section */}
          <div className="md:w-2/3 p-6 space-y-6">
            {/* Company Info */}
            <div className="space-y-2">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Company</span>
              <h1 className="text-2xl font-bold text-gray-900">{data?.company || "N/A"}</h1>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Cover Letter</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {data?.coverLetter || "No cover letter provided"}
              </p>
            </div>

            {/* Resumes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Resumes</h3>
              <div className="flex flex-col gap-3">
                
                {/* Profile Resume */}
              {resumeData ? (
                    <PDFDownloadLink
                      document={<ResumePDF basicInfo={data.user} resumeData={resumeData} />}
                      fileName="profile_resume.pdf"
                    >
                      {({ loading }) => (
                        <button className="w-full md:w-auto px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors">
                          {loading ? "Generating..." : "Download Profile Resume"}
                        </button>
                      )}
                    </PDFDownloadLink>
                  ) : (
                    <button 
                      disabled 
                      className="w-full md:w-auto px-4 py-2 bg-gray-300 text-white rounded-md cursor-not-allowed"
                    >
                      Loading Resume Data...
                    </button>
                )}

                {/* Uploaded Resume */}
                {data.resumePath ? (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`https://intern-area.onrender.com/${data.resumePath}`);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "uploaded_resume.pdf"; // Set file name
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Error downloading file:", error);
                      }
                    }}
                    className="px-4 py-2 md:w-auto bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
                  >
                    Download Uploaded Resume
                  </button>
                ) : (
                  <p className="text-gray-500">No additional resume uploaded</p>
                )}
              </div>
            </div>



            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Link to={'/applications'}>
                <button
                  onClick={() => handleStatusUpdate(data._id, "accepted")}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Accept Application
                </button>
              </Link>
              <Link to={'/applications'}>
                <button
                  onClick={() => handleStatusUpdate(data._id, "rejected")}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Reject Application
                </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetailApplication;
