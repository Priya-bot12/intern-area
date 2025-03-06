import React, { useState, useEffect, useRef } from 'react'
import logo from '../../Assests/logo.png'
import profilePhoto from '../../Assests/profilePhoto.jpg'
import { Link } from 'react-router-dom'
import "./navbar.css"
import Sidebar from './Sidebar'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { useSelector } from 'react-redux'
import { selectUser, logout } from '../../Feature/UserSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux'

function Navbar() {
    const navigate = useNavigate()
    const user = useSelector(selectUser)
    const [isDivVisibleForintern, setDivVisibleForintern] = useState(false)
    const [isDivVisibleForJob, setDivVisibleFroJob] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        setIsAdmin(userRole === "admin");
    }, []);

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileOpen(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
            setMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutFunction = async () => {
        try {
            // Clear Firebase auth
            await signOut(auth);

            // Clear Redux state
            dispatch(logout());

            // Clear local storage
            localStorage.removeItem("userRole");

            // Reset admin state
            setIsAdmin(false);
            
            Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Logged out Successfully",
                  });
            // Navigation
            navigate("/");
            setMobileMenuOpen(false);

        } catch (error) {
            toast.error("Logout failed: " + error.message);
        }
    };

    return (
        <div className="relative">
            <nav className='nav1 h-20 flex items-center'>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <Link to="/" className="ml-4">
                            <img src={logo} alt="Logo" className="h-14" />
                        </Link>

                        {!isAdmin && (
                            <div className="md:flex items-center ml-6">
                                {/* Internships Dropdown */}
                                <div
                                    className="relative group"
                                    onMouseEnter={() => setDivVisibleForintern(true)}
                                    onMouseLeave={() => setDivVisibleForintern(false)}
                                >
                                    <div className="flex items-center cursor-pointer px-4 py-2 hover:text-blue-600">
                                        <Link to="/internships" className="block px-4 py-2 hover:bg-gray-100">
                                            Internships
                                        </Link>
                                        <i className={`bi ml-1 ${isDivVisibleForintern ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} />
                                    </div>
                                    {isDivVisibleForintern && (
                                        <div className="dropdown-menu">
                                            <div className="dropdown-content">
                                                <div className="dropdown-section">
                                                    <p className="dropdown-header">Top Locations</p>
                                                    <p>Mumbai</p>
                                                    <p>Bangalore</p>
                                                    <p>Delhi</p>
                                                    <p>Hyderabad</p>
                                                </div>
                                                <div className="dropdown-section">
                                                    <p className="dropdown-header">Top Categories</p>
                                                    <p>Marketing</p>
                                                    <p>Development</p>
                                                    <p>Design</p>
                                                    <p>Business</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Jobs Dropdown */}
                                <div
                                    className="relative group ml-4"
                                    onMouseEnter={() => setDivVisibleFroJob(true)}
                                    onMouseLeave={() => setDivVisibleFroJob(false)}
                                >
                                    <div className="flex items-center cursor-pointer px-4 py-2 hover:text-blue-600">
                                        <Link to="/Jobs" className="block px-4 py-2 hover:bg-gray-100">
                                            Jobs
                                        </Link>

                                        <i className={`bi ml-1 ${isDivVisibleForJob ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} />
                                    </div>
                                    {isDivVisibleForJob && (
                                        <div className="dropdown-menu">
                                            <div className="dropdown-content">
                                                <div className="dropdown-section">
                                                    <p className="dropdown-header">Job Types</p>
                                                    <p>Full-time</p>
                                                    <p>Part-time</p>
                                                    <p>Remote</p>
                                                    <p>Contract</p>
                                                </div>
                                                <div className="dropdown-section">
                                                    <p className="dropdown-header">Experience</p>
                                                    <p>Entry Level</p>
                                                    <p>Mid Level</p>
                                                    <p>Senior Level</p>
                                                    <p>Executive</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center mr-6 space-x-4">
                        {/* Search Bar */}
                        {!isAdmin && (
                            <div className="search-container">
                                <i className="bi bi-search"></i>
                                <input type="search" placeholder='Search' />
                            </div>
                        )}

                        {user ? (
                            <>
                                <button onClick={logoutFunction} className="logout-btn">
                                    Logout
                                </button>
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="profile-btn"
                                    >
                                        <img
                                            src={user.photo || profilePhoto}
                                            alt="Profile"
                                            className="profile-img"
                                        />
                                    </button>
                                </div>
                            </>
                        ) : isAdmin ? (
                            <div className="b-c">
                                <button onClick={logoutFunction} className="logout-btn">Logout</button>
                            </div>

                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="login-btn">Login</Link>
                                <Link to="/register" className="register-btn">Register</Link>
                                <Link to="/adminLogin" className="admin-btn">Admin</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-between w-full px-4 h-full">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="mobile-logo" />
                    </Link>

                    <div className="flex items-center space-x-4">

                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="mobile-menu-btn"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div ref={mobileMenuRef} className="mobile-menu">
                        <div className="mobile-menu-content">

                            {!isAdmin && (
                                <>
                                    <Link to="/internships" className="mobile-menu-item">Internships</Link>
                                    <Link to="/Jobs" className="mobile-menu-item">Jobs</Link>
                                </>
                            )}

                            {user ? (
                                <>
                                    <button onClick={logoutFunction} className="mobile-menu-item">Logout</button>
                                    <Link to="/profile" className="mobile-menu-item">Profile</Link>
                                </>
                            ) : isAdmin ? (
                                <button onClick={logoutFunction} className="mobile-menu-item">Logout</button>
                            ) : (
                                <>
                                    <Link to="/login" className="mobile-menu-item">Login</Link>
                                    <Link to="/register" className="mobile-menu-item">Register</Link>
                                    <Link to="/adminLogin" className="mobile-menu-item">Admin Login</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <Sidebar />
        </div>
    )
}

export default Navbar