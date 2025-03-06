import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ViewAllApplication() {
  const [application, setApplication] = useState([]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get("https://intern-area.onrender.com/api/application");
        setApplication(response.data);
      } catch (error) {
        alert("Error fetching applications: " + error.message);
      }
    };
    fetchApplication();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Total Applications ({application.length})</h1>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Applied On</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Applicant</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {application.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{app.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{app.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(app?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{app.user?.fullName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/detailApplication?a=${app._id}`} className="text-blue-600 hover:text-blue-800">
                      <i className="bi bi-envelope-open"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Applications ({application.length})</h1>
        {application.map((app) => (
          <div key={app._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">{app.company}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {app.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {app.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Applicant:</span> {app.user?.fullName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Applied:</span> {new Date(app.createdAt).toLocaleDateString()}
              </p>
              <Link 
                to={`/detailApplication?a=${app._id}`}
                className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
                <i className="bi bi-chevron-right ml-1"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewAllApplication;
