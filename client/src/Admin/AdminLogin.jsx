import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import "./admin.css"

function AdminLogin() {
  const [username, setusername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


  const LoginAdmin = async () => {
    if (username === "" || password === "") {
      alert("Fill in all fields");
    } else if (username === "admin" && password === "admin") {
      try {
        // Store admin role in localStorage
        localStorage.setItem("userRole", "admin");

        window.dispatchEvent(new Event("storage"));

        Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Logged in as Admin Successfully!",
              });
        // Navigate to the admin panel
        navigate("/adminpanel");

        // Reload the page to ensure navbar updates
        window.location.reload();
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    } else {
      Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Invalid username or password",
            });
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Admin Login</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Please enter your credentials to access the admin dashboard.</p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="pass" className="leading-7 text-sm text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"  // Corrected type
                    id="pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <button onClick={LoginAdmin} className='btnlogin'>Login</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminLogin