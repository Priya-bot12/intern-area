import React from 'react'
import { Link } from 'react-router-dom'
import { RiSendPlaneFill } from "react-icons/ri";
import { BsMailbox2Flag } from "react-icons/bs";
import { Briefcase } from "lucide-react";
import "./admin.css"

function Adminpanel() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-screen-lg p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Admin Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* View Applications */}
          <Link
            to="/applications"
            className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <BsMailbox2Flag size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">View Applications</h3>
              <p className="text-sm text-gray-500">Check applications received from applicants.</p>
            </div>
          </Link>

          {/* Post Job */}
          <Link
            to="/postJob"
            className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Post Job</h3>
              <p className="text-sm text-gray-500">List job openings based on your needs.</p>
            </div>
          </Link>

          {/* Post Internship */}
          <Link
            to="/postInternship"
            className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <RiSendPlaneFill size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Post Internship</h3>
              <p className="text-sm text-gray-500">Publish internship opportunities easily.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Adminpanel