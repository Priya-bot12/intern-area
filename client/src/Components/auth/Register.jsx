import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, provider, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./register.css";
import Swal from "sweetalert2";



function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkEmailExists = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const emailExists = await checkEmailExists(user.email);
      if (!emailExists) {
        await setDoc(doc(db, "users", user.uid), {
          fullName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          uid: user.uid,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Google sign-in failed!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    // Validation checks
    if (!/^\d{10}$/.test(phone)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Phone number must be exactly of 10 digits!",
      });
      return;
    }
    // Validation checks
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists in Firebase Authentication
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email is already registered. Please Log-in!",
        });
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: email,
        phoneNumber: phone,
        uid: user.uid,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
      });
      navigate("/"); // Navigate after successful creation
    } catch (error) {
      console.error("Registration Error:", error); // Added logging
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Registration failed. Please try again later!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form">
        <h1>Create an Account</h1>
        <p className="para3">Join thousands of professionals</p>
        <div className="register">
          <div className="py-6">
            <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
              <div className="w-full p-8 lg:w-1/2">
                <div
                  role="button"
                  onClick={handleSignInWithGoogle}
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

                <div className="mt-4 flex items-center justify-between">
                  <span className="border-b w-1/5 lg:w-1/4"></span>
                  <p className="text-xs text-center text-gray-500 uppercase">or</p>
                  <span className="border-b w-1/5 lg:w-1/4"></span>
                </div>

                <form onSubmit={handleRegister}>
                  {["name", "email", "phone", "password", "confirmPassword"].map((field) => (
                    <div key={field} className="mt-4">
                      <label className="block text-gray-700 text-sm mb-2">
                        {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field.includes("password") ? "password" : "text"}
                        name={field}
                        placeholder={`Enter your ${field}`}
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;