import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../Feature/UserSlice';
import { toast } from 'react-toastify';

function UserApplication() {
  const [application, setApplication] = useState([]);
  const user = useSelector(selectUser);
  const userApplications = application.filter(app => 
    app.user?.email && user?.email && app.user.email === user.email
  );

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get("https://intern-area.onrender.com/api/application");
        setApplication(response.data);
      } catch (error) {
        toast.error("Error fetching applications");
      }
    };
    fetchApplication();
  }, []); // Empty dependency array

  if (!user) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Desktop View */}
      <div className="hidden md:block">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Applications ({userApplications.length})</h1>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Applied On</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userApplications.map((data) => (
                <tr key={data._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{data.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{data.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(data?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      data.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {data.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/UserapplicationDetail?a=${data._id}`} className="text-blue-600 hover:text-blue-800">
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Applications ({userApplications.length})</h1>
        {userApplications.map((data) => (
          <div key={data._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">{data.company}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  data.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {data.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {data.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Applied:</span> {new Date(data.createdAt).toLocaleDateString()}
              </p>
              <Link 
                to={`/UserapplicationDetail?a=${data._id}`}
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

export default UserApplication;
