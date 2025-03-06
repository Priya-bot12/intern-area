import React, { useState, useEffect } from "react";
import { signInWithPopup, signInWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../../firebase/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { isMobile } from "react-device-detect";
import { UAParser } from 'ua-parser-js';
import Swal from "sweetalert2";
import axios from "axios";
import "./login.css";

// Add this function to send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const response = await fetch('https://intern-area.onrender.com/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Track login information
  const trackLogin = async (user) => {
    try {
      const parser = new UAParser();
      const ua = parser.getResult();
      const ipData = await axios.get('https://ipapi.co/json/');
      
      const loginData = {
        timestamp: serverTimestamp(),
        device: {
          type: isMobile ? 'mobile' : 'desktop',
          browser: ua.browser.name,
          os: ua.os.name,
          device: ua.device.model || 'Desktop',
        },
        ip: ipData.data.ip,
        location: {
          city: ipData.data.city,
          region: ipData.data.region,
          country: ipData.data.country_name,
        }
      };

      await addDoc(collection(db, "users", user.uid, "loginHistory"), loginData);
    } catch (error) {
      console.error("Error tracking login:", error);
    }
  };

  const checkMobileTime = () => {
    if (!isMobile) return true;
    const now = new Date();
    const hours = now.getHours();
    return hours >= 10 && hours < 13;
  };

  const handleGoogleSignIn = async () => {
    if (isMobile && !checkMobileTime()) {
      Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Mobile login allowed only between 10 AM to 1 PM!",
            });
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      await trackLogin(res.user);
      Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Logged in Successfully!",
            });
      navigate("/");
    } catch (err) {
      Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Google log in fail!",
            });
    }
    setLoading(false);
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the OTP!",
      });
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "otps", email);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().otp === otp) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await trackLogin(userCredential.user);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Logged in Successfully!",
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid OTP!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "OTP verification failed!",
      });
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter Email!",
      });
      return;
    }

    if (otpSent) {
      await handleOtpVerification();
      return;
    }

    const parser = new UAParser();
    const isChrome = parser.getBrowser().name === 'Chrome';

    if (isChrome) {
      setLoading(true);
      try {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        
        // Save OTP to Firestore
        await setDoc(doc(db, "otps", email), {
          otp: generatedOtp.toString(),
          expiresAt: new Date(Date.now() + 300000)
        });

        // Send OTP via email
        await sendOtpEmail(email, generatedOtp.toString());

        setOtpSent(true);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "OTP sent to your email!",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error in sending OTP!",
        });
      }
      setLoading(false);
      return;
    }
    // Regular email/password login
    if (!password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter password!",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await trackLogin(userCredential.user);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Logged in successfully!",
      });
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error);
      switch (error.code) {
        case "auth/user-not-found":
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No account found with this email!",
          });
          break;
        case "auth/wrong-password":
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Incorrect password!",
          });
          break;
        default:
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Login failed please try again later!",
          });
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="form">
        <div className="login">
          <h1 className="mt-10">Login to Your Account</h1>
          <p className="para3">Start applying for jobs and internships</p>
          <div className="py-6">
            <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
              <div className="w-full p-8 lg:w-1/2">
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  {!otpSent && (
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter password"
                      />
                    </div>
                  )}

                  {otpSent && (
                    <div className="form-group">
                      <label>OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-blue-500 h-9 text-white font-bold py-2 mt-4 px-4 w-full rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : otpSent ? "Verify OTP" : "Login"}
                  </button>

                  <div className="text-center mt-4">
                    <span
                      className="text-blue-400 cursor-pointer"
                      onClick={() => navigate("/forget")}
                    >
                      Forgot Password?
                    </span>
                  </div>
                </form>

                <div className="mt-4 flex items-center justify-between">
                  <span className="border-b w-1/5 lg:w-1/4"></span>
                  <p className="text-xs text-center text-gray-500 uppercase">or</p>
                  <span className="border-b w-1/5 lg:w-1/4"></span>
                </div>

                <div
                  role="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={`flex items-center justify-center w-full gap-3 py-3.5 px-4 mt-4 text-gray-700 font-medium 
    bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 
    transition-all duration-200 ease-out ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {!loading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Continue with Google"
                  )}
                </div>


                <div className="mt-4 text-center text-sm text-gray-600">
                <br></br>
                  Don't have an account?{" "}
                  <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
