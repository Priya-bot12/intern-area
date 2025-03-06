import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { collection, query, getDocs } from "firebase/firestore";

const LoginHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "users", user.uid, "loginHistory"));
      const querySnapshot = await getDocs(q);
      setHistory(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
        Login History
      </h2>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-left text-sm md:text-base">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Device</th>
              <th className="p-3 border-b">Browser</th>
              <th className="p-3 border-b">Location</th>
              <th className="p-3 border-b">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((entry, index) => (
                <tr key={index} className="text-sm md:text-base text-gray-800 border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(entry.timestamp?.seconds * 1000).toLocaleString()}</td>
                  <td className="p-3">{entry.device?.type || "Unknown"}</td>
                  <td className="p-3">{entry.device?.browser || "Unknown"}</td>
                  <td className="p-3">{entry.location?.city || "N/A"}, {entry.location?.country || "N/A"}</td>
                  <td className="p-3">{entry.ip || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  No login history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;
