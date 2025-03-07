import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser, updateProfilePhoto } from '../Feature/UserSlice';
import { auth } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import profilePhoto from '../Assests/profilePhoto.jpg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiEdit, FiTrash, FiPlus, FiDownload } from 'react-icons/fi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { db, storage } from '../firebase/firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ResumePDF from './ResumePDF';


function Profile() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [isEditingResume, setIsEditingResume] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState(user?.resume || {
        objective: '',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        accomplishments: []
    });


    const [basicInfo, setBasicInfo] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        location: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (auth.currentUser) {
                    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        dispatch(updateUser(userData));
                        
                        // Update local states with fresh data
                        setBasicInfo({
                            fullName: userData.fullName || '',
                            email: userData.email || '',
                            phoneNumber: userData.phoneNumber || '',
                            location: userData.location || ''
                        });

                        if (userData.resume) {
                            setResumeData(userData.resume);
                        }
                    }
                }
            } catch (error) {
                toast.error("Error loading user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [dispatch, user?.uid]);
      
    const calculateProfileCompletion = () => {
        const requiredFields = [
            basicInfo.fullName,
            basicInfo.email,
            basicInfo.phoneNumber,
            resumeData.objective,
            resumeData.education.length,
            resumeData.skills.length,
            resumeData.experience.length
        ];
        const filledFields = requiredFields.filter(field =>
            (Array.isArray(field) ? field.length > 0 : Boolean(field))
        ).length;
        return Math.round((filledFields / requiredFields.length) * 100);
    };

    const handleUpdateResume = async () => {
        if (!basicInfo.fullName || !basicInfo.email || !basicInfo.phoneNumber) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const userData = {
                fullName: basicInfo.fullName,
                email: basicInfo.email,
                phoneNumber: basicInfo.phoneNumber,
                location: basicInfo.location,
                resume: resumeData,
                photoURL: user?.photoURL || ''
            };

            await setDoc(doc(db, "users", auth.currentUser.uid), userData, { merge: true });
            await updateProfile(auth.currentUser, {
                displayName: basicInfo.fullName,
                photoURL: user?.photoURL || ''
            });

            dispatch(updateUser(userData));
            toast.success("Resume updated successfully");
            setIsEditingResume(false);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };// Update Firestore user document (assuming you're using Firestore)


    // Education Handlers
    const handleAddEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, {
                degree: '',
                university: '',
                duration: '',
                gpa: ''
            }]
        }));
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...resumeData.education];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, education: updated }));
    };

    const handleRemoveEducation = (index) => {
        const updated = resumeData.education.filter((_, i) => i !== index);
        setResumeData(prev => ({ ...prev, education: updated }));
    };

    // Experience Handlers
    const handleAddExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                position: '',
                company: '',
                duration: '',
                description: ''
            }]
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const updated = [...resumeData.experience];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, experience: updated }));
    };

    const handleRemoveExperience = (index) => {
        const updated = resumeData.experience.filter((_, i) => i !== index);
        setResumeData(prev => ({ ...prev, experience: updated }));
    };

    // Skills Handlers
    const handleAddSkill = (e) => {
        const value = e.target.value.trim();
        if (e.key === 'Enter' && value) {
            setResumeData(prev => ({
                ...prev,
                skills: [...prev.skills, value]
            }));
            e.target.value = '';
        }
    };

    const handleRemoveSkill = (index) => {
        const updated = resumeData.skills.filter((_, i) => i !== index);
        setResumeData(prev => ({ ...prev, skills: updated }));
    };

    // Project Handlers
    const handleAddProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                title: '',
                duration: '',
                description: '',
                link: ''
            }]
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const updated = [...resumeData.projects];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, projects: updated }));
    };

    const handleRemoveProject = (index) => {
        const updated = resumeData.projects.filter((_, i) => i !== index);
        setResumeData(prev => ({ ...prev, projects: updated }));
    };

    // Certification Handlers
    const handleAddCertification = () => {
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                Name: '',
                issuer: '',
                date: ''
            }]
        }));
    };

    const handleCertificationChange = (index, field, value) => {
        const updated = [...resumeData.certifications];
        updated[index][field] = value;
        setResumeData(prev => ({ ...prev, certifications: updated }));
    };

    const handleRemoveCertification = (index) => {
        const updated = resumeData.certifications.filter((_, i) => i !== index);
        setResumeData(prev => ({ ...prev, certifications: updated }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 flex justify-center px-4">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6">
                {/* Profile Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 space-y-6 md:space-y-0">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <label
                            htmlFor="profilePhotoInput"
                            className="relative cursor-pointer group"
                        >
                            <div className="relative w-32 h-32">
                                <img
                                    src={user?.photoURL || profilePhoto}
                                    alt="Profile"
                                    className="w-full h-full rounded-full border-4 border-blue-100 object-cover"
                                />
                                
                            </div>
                            
                        </label>

                        <div className="space-y-2 flex-1">
                            {isEditingResume ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        value={basicInfo.fullName}
                                        onChange={(e) => setBasicInfo(p => ({ ...p, fullName: e.target.value }))}
                                        placeholder="Full Name"
                                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="email"
                                        value={basicInfo.email}
                                        onChange={(e) => setBasicInfo(p => ({ ...p, email: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Email"
                                    />
                                    <input
                                        type="tel"
                                        value={basicInfo.phoneNumber}
                                        onChange={(e) => setBasicInfo(p => ({ ...p, phoneNumber: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Phone Number"
                                    />
                                    <input
                                        type="text"
                                        value={basicInfo.location}
                                        onChange={(e) => setBasicInfo(p => ({ ...p, location: e.target.value }))}
                                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Location"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-gray-800">{basicInfo.fullName}</h1>
                                    <p className="text-gray-600"><span className="font-medium">Email:</span> {basicInfo.email}</p>
                                    <p className="text-gray-600"><span className="font-medium">Phone:</span> {basicInfo.phoneNumber}</p>
                                    <p className="text-gray-600"><span className="font-medium">Location:</span> {basicInfo.location}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-28 h-28">
                        <CircularProgressbar
                            value={calculateProfileCompletion()}
                            text={`${calculateProfileCompletion()}%`}
                            styles={buildStyles({
                                pathColor: `rgba(37, 99, 235, ${calculateProfileCompletion() / 100})`,
                                textColor: '#1f2937',
                                trailColor: '#e5e7eb',
                            })}
                        />
                    </div>
                </div>


                {isEditingResume ? (
                    <div className="space-y-8">
                        {/* Career Objective */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Career Objective</h3>
                            <textarea
                                value={resumeData.objective}
                                onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                                className="w-full p-2 border rounded"
                                rows="3"
                                placeholder="Summarize your professional goals"
                            />
                        </div>

                        {/* Education Section */}
                        <SectionWrapper
                            title="Education"
                            onAdd={handleAddEducation}
                            items={resumeData.education}
                            fields={['degree', 'university', 'duration', 'gpa']}
                            labels={['Degree', 'University', 'Duration', 'GPA']}
                            onChange={handleEducationChange}
                            onRemove={handleRemoveEducation}
                        />

                        {/* Experience Section */}
                        <SectionWrapper
                            title="Work Experience"
                            onAdd={handleAddExperience}
                            items={resumeData.experience}
                            fields={['position', 'company', 'duration', 'description']}
                            labels={['Position', 'Company', 'Duration', 'Description']}
                            onChange={handleExperienceChange}
                            onRemove={handleRemoveExperience}
                        />

                        {/* Skills Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Skills</h3>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    onKeyPress={handleAddSkill}
                                    className="p-2 border rounded w-full"
                                    placeholder="Add skill and press Enter"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.map((skill, index) => (
                                    <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                                        <span>{skill}</span>
                                        <button
                                            onClick={() => handleRemoveSkill(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <FiTrash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects Section */}
                        <SectionWrapper
                            title="Projects"
                            onAdd={handleAddProject}
                            items={resumeData.projects}
                            fields={['title', 'duration', 'description', 'link']}
                            labels={['Title', 'Duration', 'Description', 'Link']}
                            onChange={handleProjectChange}
                            onRemove={handleRemoveProject}
                        />

                        {/* Certifications Section */}
                        <SectionWrapper
                            title="Certifications"
                            onAdd={handleAddCertification}
                            items={resumeData.certifications}
                            fields={['name', 'issuer', 'date']}
                            labels={['name','issuer', 'Date']}
                            onChange={handleCertificationChange}
                            onRemove={handleRemoveCertification}
                        />

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={handleUpdateResume}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <FiEdit className="text-lg" />
                                <span>Save Changes</span>
                            </button>
                            <button
                                onClick={() => setIsEditingResume(false)}
                                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <PDFDownloadLink
                                document={<ResumePDF basicInfo={basicInfo} resumeData={resumeData} />}
                                fileName="resume.pdf"
                            >
                                {({ loading }) => (
                                    <button
                                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center mb-4"
                                        disabled={loading}
                                    >
                                        <FiDownload className="mr-2" />
                                        {loading ? 'Generating PDF...' : 'Download PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>

                            {/* Resume Preview Content */}
                            <ResumePreview basicInfo={basicInfo} resumeData={resumeData} />
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center w-full">
                            <button
                                onClick={() => setIsEditingResume(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
                            >
                                <FiEdit className="mr-2" /> Edit Resume
                            </button>
                            <Link
                                to="/userapplication"
                                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 w-full sm:w-auto text-center"
                            >
                                View Applications
                            </Link>
                            <Link
                                to="/login-history"
                                className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 w-full sm:w-auto text-center"
                            >
                                Login History
                            </Link>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable Section Component
const SectionWrapper = ({ title, items, fields, labels, onAdd, onChange, onRemove }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
                onClick={onAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
                <FiPlus className="mr-2" /> Add
            </button>
        </div>
        {items.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-4">
                <div className="grid grid-cols-2 gap-4">
                    {fields.map((field, i) => (
                        <input
                            key={field}
                            type="text"
                            placeholder={labels[i]}
                            value={item[field]}
                            onChange={(e) => onChange(index, field, e.target.value)}
                            className="p-2 border rounded"
                        />
                    ))}
                </div>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={() => onRemove(index)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                    >
                        <FiTrash className="mr-1" /> Remove
                    </button>
                </div>
            </div>
        ))}
    </div>
);

// Resume Preview Component
const ResumePreview = ({ basicInfo, resumeData }) => (
    <div className="space-y-6">
        <div className="mb-6">
            <h1 className="text-2xl font-bold">{basicInfo.fullName}</h1>
            <p className="text-gray-600">{basicInfo.email}</p>
            <p className="text-gray-600">{basicInfo.phoneNumber}</p>
            <p className="text-gray-600">{basicInfo.location}</p>
        </div>

        {resumeData.objective && (
            <SectionPreview title="Career Objective">
                <p>{resumeData.objective}</p>
            </SectionPreview>
        )}

        {resumeData.education.length > 0 && (
            <SectionPreview title="Education">
                {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.university}</p>
                        <p className="text-gray-600">{edu.duration} | GPA: {edu.gpa}</p>
                    </div>
                ))}
            </SectionPreview>
        )}

        {resumeData.experience.length > 0 && (
            <SectionPreview title="Work Experience">
                {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-gray-600">{exp.duration}</p>
                        <p className="text-gray-800 mt-2">{exp.description}</p>
                    </div>
                ))}
            </SectionPreview>
        )}

        {resumeData.skills.length > 0 && (
            <SectionPreview title="Skills">
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </SectionPreview>
        )}

        {resumeData.projects.length > 0 && (
            <SectionPreview title="Projects">
                {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-gray-600">{project.duration}</p>
                        <p className="text-gray-800">{project.description}</p>
                        {project.link && (
                            <a href={project.link} className="text-blue-600 hover:underline">
                                View Project
                            </a>
                        )}
                    </div>
                ))}
            </SectionPreview>
        )}
    </div>
);

const SectionPreview = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="pl-4">
            {children}
        </div>
    </div>
);

export default Profile;

