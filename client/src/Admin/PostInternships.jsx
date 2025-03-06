import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


function Postinternships() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    category: '',
    aboutCompany: '',
    aboutInternship: '',
    Whocanapply: '',
    perks: '',
    numberOfOpening: '',
    stipend: '',
    startDate: '',
    duration: '',
    AdditionalInfo: '',
    logo: null
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0]
    });
  };

  const sendData = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      'title', 'company', 'location', 'category',
      'aboutCompany', 'aboutInternship', 'Whocanapply',
      'perks', 'numberOfOpening', 'stipend',
      'startDate', 'duration', 'AdditionalInfo'
    ];
    if (requiredFields.some(field => !formData[field])) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all the required fields!",
      });
      return;
    }

    if (requiredFields.some(field => !formData[field])) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "PLease fill all the required fields",
      });
      return;
    }

    try {
      const data = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          data.append('logo', value);
        } else {
          data.append(key, value);
        }
      });

      await axios.post("https://intern-area.onrender.com/api/internship", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Internship Posted Successfully",
      });
      navigate("/adminpanel");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error posting internship",
      });
    }
  };

  return (
  <>
    
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Post an Internship
          </h2>
        </div>

        <form className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2" onSubmit={sendData}>
          {/* Add file input */}
          <div className="sm:col-span-2">
            <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">
              Company Logo
            </label>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              accept="image/*"
            />
          </div>

          {/* Update other inputs to use handleChange */}
          <div>
            <label className="mb-2 inline-block text-sm text-gray-800 sm:text-base">
              Title*
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
          </div>

          <div>
            <label for="company" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Company Name*</label>
            <input name="company" value={formData.companyName} onChange={handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>

          <div className="sm:col-span-2">
            <label for="location" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Location*</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>

          <div className="sm:col-span-2">
            <label for="category" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Category*</label>
            <input name="category" value={formData.category} onChange={handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>

          <div className="sm:col-span-2">
            <label for="aboutCompany" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">About Company*</label>
            <input name="aboutCompany" value={formData.aboutCompany} onChange={handleChange} className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>

          <div className="sm:col-span-2">
            <label for="aboutInternship" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">About Internship*</label>
            <textarea name="aboutInternship" value={formData.aboutInternship} onChange={handleChange} className="h-64 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
          </div>
          <div className="sm:col-span-2">
            <label for="Whocanapply" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Who can apply*</label>
            <textarea name="Whocanapply" value={formData.Whocanapply} onChange={handleChange} className="h-34 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
          </div>
          <div className="sm:col-span-2">
            <label for="perks" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Perks*</label>
            <textarea name="perks" value={formData.perks} onChange={handleChange} className="h-34 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
          </div>
          <div className="sm:col-span-2">
            <label for="numberOfOpening" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Number Of Opening*</label>
            <input name="numberOfOpening" value={formData.numberOfOpening} onChange={handleChange} className=" w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></input>
          </div>
          <div className="sm:col-span-2">
            <label for="stipend" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Stipend*</label>
            <input name="stipend" value={formData.stipend} onChange={handleChange} className=" w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></input>
          </div>
          <div className="sm:col-span-2">
            <label for="duration" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Duration*</label>
            <input name="duration" value={formData.duration} onChange={handleChange} className=" w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></input>
          </div>
          <div className="sm:col-span-2">
            <label for="startDate" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Start Date*</label>
            <input type='date' value={formData.startDate} onChange={handleChange} name="startDate" className=" w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></input>
          </div>

          <div className="sm:col-span-2">
            <label for="AdditionalInfo" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Additional Information*</label>
            <textarea name="AdditionalInfo" value={formData.AdditionalInfo} onChange={handleChange} className="h-34 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"></textarea>
          </div>
          <div className='button-container'>
            <button>Post Internship</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Postinternships
