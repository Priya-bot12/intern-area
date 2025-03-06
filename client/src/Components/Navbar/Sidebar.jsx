import React, { useEffect, useRef, useState } from 'react'
import logo from "../../Assests/logo.png"
import './sidebar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../Feature/UserSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Sidebar.js
    const logoutFunction = async () => {
        try {
            await signOut(auth);
            navigate("/");
            setSidebarOpen(false);

            // Force clear all browser storage
            localStorage.clear();
            sessionStorage.clear();

            // Optional: Clear service worker cache
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleSidebar}
                className="fixed right-4 top-4 z-40 p-2 text-2xl"
            >

            </button>

            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <img src={logo} alt="Logo" className="h-8" />
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="text-2xl focus:outline-none"
                        >
                            ×
                        </button>
                    </div>

                    {user && (
                        <div className="mb-6">
                            <Link
                                to="/profile"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center space-x-2"
                            >
                                <img
                                    src={user.photo}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                                />
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </Link>
                        </div>
                    )}

                    <nav className="space-y-2">
                        <Link
                            to="/internships"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-100 rounded"
                        >
                            Internships
                        </Link>
                        <Link
                            to="/Jobs"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-100 rounded"
                        >
                            Jobs
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/userapplication"
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                                >
                                    My Applications
                                </Link>
                            
                                <button
                                    onClick={logoutFunction}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Sidebar