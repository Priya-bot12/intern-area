import './App.css';
import Footer from './Components/Footerr/Footer';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import { Routes,Route,useLocation } from 'react-router-dom';
import Register from './Components/auth/Register';
import ForgotPassword from './Components/auth/ForgotPassword';
import Login from './Components/auth/Login';
import LoginHistory from './Components/auth/LoginHistory';
import Intern from "./Components/Internships/Intern"
import JobAvl from "./Components/Job/JobAvl"
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebase"; 
import JobDetail from './Components/Job/JobDetail';
import InternDeatil from "./Components/Internships/InternDetail"
import { useDispatch, useSelector } from 'react-redux';
import { login,logout,selectUser } from "./Feature/UserSlice"
import { useEffect } from 'react';
import { auth } from './firebase/firebase';
import Profile from './profile/Profile';
import AdminLogin from './Admin/AdminLogin';
import Adminpanel from './Admin/Adminpanel';
import ViewAllApplication from "./Admin/ViewAllApplication"
import Postinternships from './Admin/PostInternships';
import PostJob from './Admin/PostJob';
import ChatBot from './Components/ChatBot';
import DetailApplication from './Applications/DetailApplication';
import UserApplication from './profile/UserApplication';
import UserapplicationDetail from "./Applications/DetailApplicationUser"

function App() {
  const user=useSelector(selectUser);
  const dispatch=useDispatch();
  const location = useLocation();
  useEffect(() => {
    const checkAuthState = async () => {
      auth.onAuthStateChanged(async (authUser) => {
        console.log("Auth state changed:", authUser); // Debugging log
        if (authUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", authUser.uid));
            const userData = userDoc.data();
  
            dispatch(login({
              uid: authUser.uid,
              photo: authUser.photoURL,
              fullName: authUser.displayName || userData?.fullName,
              email: authUser.email,
              phoneNumber: userData?.phoneNumber
            }));
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          dispatch(logout());
        }
      });
    };
  
    checkAuthState(); // Call the function
  
  }, [dispatch]);
  return (

<div className="App">
{location.pathname !== '/forget' && <Navbar />}
{!(
    location.pathname === '/forget' || 
    location.pathname === '/detailApplication' || 
    location.pathname === '/applications' || 
    location.pathname === '/adminpanel' || 
    location.pathname === '/postInternship' || 
    location.pathname === '/postJob'
  ) && (
    <ChatBot 
      isLoggedIn={!!user} 
      userName={user?.fullName || ''}
    />
)}

<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/register' element={<Register/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/login-history' element={<LoginHistory/>}/>
  <Route path='/forget' element={<ForgotPassword/>}/>
  <Route path='/internships' element={<Intern/>}/>
  <Route path='/Jobs' element={<JobAvl/>}/>
  <Route path='/profile' element={<Profile/>}/>
  <Route path='/detailjob' element={<JobDetail/>}/>
  <Route path="/detailApplication" element={<DetailApplication />} />
  <Route path='/detailInternship' element={<InternDeatil/>}/>
  <Route path='/adminLogin' element={<AdminLogin/>}/>
  <Route path='/adminpanel' element={<Adminpanel/>}/>
  <Route path='/postInternship' element={<Postinternships/>}/>
   <Route path='/internships/:id' element={<InternDeatil/>}/>
  <Route path='/postJob' element={<PostJob/>}/>
  <Route path='/applications' element={<ViewAllApplication/>}/>
  <Route path='/UserapplicationDetail' element={< UserapplicationDetail/>}/>
  <Route path='/userapplication' element={<UserApplication/>}/>
</Routes>
{location.pathname !== '/forget' && <Footer />}
    </div>
  );
}

export default App;