import axios from "axios";
import React, { useEffect, useState } from "react";
import profilePhoto from '../Assests/profilePhoto.jpg';

function DetailApplication() {
  const [data, setData] = useState(null);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("a");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/application/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching application data:", error);
        alert("Error loading application details");
      }
    };
    fetchData();
  }, [id]);

  if (!data) {
    return <div className="p-8 text-center text-gray-600">Loading application details...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <img
              alt="Company"
              className="w-full h-64 object-cover rounded-lg"
              src={profilePhoto || "/placeholder.jpg"}
            />
            <div className="mt-4 space-y-2">
              <p className="text-xl font-semibold text-gray-800">{data?.company || "Company"}</p>
              <p className="text-gray-600">Applied on: {new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6 space-y-6">
            {/* Application Info */}
            <div className="space-y-2">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Application Status</span>
              <h1 className="text-2xl font-bold text-gray-900">{data?.status || "Pending"}</h1>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Your Cover Letter</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {data?.coverLetter || "No cover letter provided"}
              </p>
            </div>

            {/* Resumes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Submitted Resumes</h3>
              <div className="flex flex-col gap-3">
                {data.resumePath ? (
                  <a
                    href={`http://localhost:5000/${data.resumePath}`}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                  >
                    Download Submitted Resume
                  </a>
                ) : (
                  <p className="text-gray-500">No resume uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetailApplication;