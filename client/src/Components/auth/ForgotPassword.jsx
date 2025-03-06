import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    setGeneratedPassword(password);
    setUseGeneratedPassword(true);
  };

  const checkResetLimit = async (email) => {
    const userRef = doc(db, "password_resets", email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const lastRequest = userSnap.data().last_reset_request.toDate();
      const today = new Date();
      
      if (
        lastRequest.getDate() === today.getDate() &&
        lastRequest.getMonth() === today.getMonth() &&
        lastRequest.getFullYear() === today.getFullYear()
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const canRequest = await checkResetLimit(email);
      if (!canRequest) {
        throw new Error("You can only reset your password once per day");
      }

      await sendPasswordResetEmail(auth, email);
      await setDoc(doc(db, "password_resets", email), {
        last_reset_request: new Date(),
      });

      toast.success("Password reset link sent to your email");
      if (useGeneratedPassword) {
        toast.info(`Generated Password: ${generatedPassword} - Copy this for later use`);
      }
    } catch (error) {
      toast.error(error.message || "Error sending reset email");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-page">
      <ToastContainer />
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
            />
          </div>

          <div className="password-generator">
            <button
              type="button"
              onClick={generatePassword}
              className="generate-btn"
            >
              Generate Secure Password
            </button>
            
            {generatedPassword && (
              <div className="generated-password">
                <span>Generated Password: {generatedPassword}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUseGeneratedPassword(!useGeneratedPassword);
                    navigator.clipboard.writeText(generatedPassword);
                    toast.info("Password copied to clipboard!");
                  }}
                >
                  {useGeneratedPassword ? "Copy" : "Use"}
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="back-to-login">
          <p>Remembered your password? <a href="/login">Go back to login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;