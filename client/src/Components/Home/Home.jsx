import React, { useEffect, useState } from 'react'
import first from "../../Assests/Firstslide.png"
import second from "../../Assests/secondslide.webp"
import third from "../../Assests/thirdsilde.webp"
import fouth from "../../Assests/fourthslide.webp"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./home.css"
import Job from './Job'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState("Big Brands")
    const [internshipData, setInternshipData] = useState([])
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/internship')
                setInternshipData(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    const filterInternShips = internshipData.filter((item) =>
        !selectedCategory || item.category === selectedCategory
    )

    const handleSlide = (direction) => {
        const container = document.getElementById("container");
        const step = 100;
        if (direction === 'left') {
            setCurrentSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : 0))
        } else {
            setCurrentSlide((prevSlide) => (prevSlide < 3 ? prevSlide + 1 : 3))
        }
        sideScroll(container, direction, 25, step, 10)
    }

    const handleSlideIntern = (direction) => {
        const container = document.getElementById("container2");
        const step = 100;
        if (direction === 'left') {
            setCurrentSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : 0))
        } else {
            setCurrentSlide((prevSlide) => (prevSlide < 3 ? prevSlide + 1 : 3))
        }
        sideScroll(container, direction, 25, step, 10)
    }

    return (
        <>
            <ToastContainer />
            <h1 className='text-center text-3xl font-bold mt-4'>Make your dream career a reality</h1>
            <p className='text-center text-lg font-bold'>Trending on InternArea 🔥</p>

            <div className="imgs flex justify-center" id='container'>
                <div className="slide flex mt-10" id='content'>
                    <img className='slide_Img ml-4' src={first} alt="" />
                    <img className='slide_Img ml-4' src={second} alt="" />
                    <img className='slide_Img ml-4' src={third} alt="" />
                    <img className='slide_Img ml-4' src={fouth} alt="" />
                </div>
            </div>
            <div className="flex BUttons">
                <button className='back' onClick={() => handleSlide('left')}> <i className='bi bi-chevron-left' id='sideBack'></i></button>
                <button className="next" onClick={() => handleSlide('right')}> <i className='bi bi-chevron-right' id='slide'></i></button>
            </div>

            <section className="mt-16 ml-8 mr-8">
                <h2 className='text-center text-3xl font-bold text-gray-900 mb-8'>
                    Latest on Intern Area
                </h2>

                <div className="mb-8">
                <span className='ml-2'>Popular Categories in Internships:</span>
                    <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                        {["Big Brands", "Work From Home", "Part-time", "MBA", "Engineering", "Media", "Design"
                            ,"Data Science", "Market Research",
                            "Hospital Management", "EdTech","Legal and Law", "Hotel Management"
                        ].map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap 
                                    ${selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    {isMobile ? (
                        // Mobile Vertical Layout
                        <div className="grid grid-cols-1 gap-6 px-4">
                            {filterInternShips.length === 0 ? (
                                <div className="w-full text-center py-8">
                                    <p className="text-gray-500">No internships available in this category</p>
                                </div>
                            ) : (
                                filterInternShips.map((data, index) => (
                                    <div key={index} className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                                        <div className="flex items-center mb-4">
                                            <i className='bi bi-arrow-up-right text-blue-600 mr-2'></i>
                                            <span className="text-sm font-medium text-blue-600">Actively Hiring</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{data.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{data.company}</p>
                                        <hr className="mb-4" />
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center">
                                                <i className="bi bi-geo-alt-fill text-gray-400 mr-2"></i>
                                                <span>{data.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="bi bi-cash-stack text-gray-400 mr-2"></i>
                                                <span>{data.stipend}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="bi bi-calendar-fill text-gray-400 mr-2"></i>
                                                <span>{data.duration}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-6">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-sm">
                                                Internship
                                            </span>
                                            <Link
                                                to={`/detailInternship?q=${data._id}`}
                                                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View details
                                                <i className="bi bi-chevron-right ml-1"></i>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Desktop/Tablet Horizontal Scroll Layout
                        <>
                            <div className="overflow-hidden" id="container2">
                                <div className="flex gap-6 pb-4" id="content">
                                    {filterInternShips.length === 0 ? (
                                        <div className="w-full text-center py-8">
                                            <p className="text-gray-500">No internships available in this category</p>
                                        </div>
                                    ) : (
                                        filterInternShips.map((data, index) => (
                                            <div key={index} className="flex-none w-80 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                                                <div className="flex items-center mb-4">
                                                    <i className='bi bi-arrow-up-right text-blue-600 mr-2'></i>
                                                    <span className="text-sm font-medium text-blue-600">Actively Hiring</span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{data.title}</h3>
                                                <p className="text-sm text-gray-500 mb-4">{data.company}</p>
                                                <hr className="mb-4" />
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center">
                                                        <i className="bi bi-geo-alt-fill text-gray-400 mr-2"></i>
                                                        <span>{data.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <i className="bi bi-cash-stack text-gray-400 mr-2"></i>
                                                        <span>{data.stipend}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <i className="bi bi-calendar-fill text-gray-400 mr-2"></i>
                                                        <span>{data.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-6">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-md text-sm">
                                                        Internship
                                                    </span>
                                                    <Link
                                                        to={`/detailInternship?q=${data._id}`}
                                                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        View details
                                                        <i className="bi bi-chevron-right ml-1"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button className='back' onClick={() => handleSlideIntern('left')}>
                                    <i className='bi bi-chevron-left' id='sideBack'></i>
                                </button>
                                <button className="next" onClick={() => handleSlideIntern('right')}>
                                    <i className='bi bi-chevron-right' id='slide'></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
                <Job/>
                <br></br>
<hr/>

<div className="analytics mt-16 py-12 bg-gray-50 w-full">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
    {[
      ['300K+', 'companies hiring'],
      ['10K+', 'new openings everyday'],
      ['21Mn+', 'active students'],
      ['600K+', 'learners']
    ].map(([value, text], index) => (
      <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span className='font-bold text-4xl lg:text-5xl text-blue-600 block mb-3'>{value}</span>
        <p className='text-gray-600 text-lg'>{text}</p>
      </div>
    ))}
  </div>
</div>

<div className="logins bg-blue-800 py-8 mt-16 w-full">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    <p className="text-white text-2xl font-semibold mb-6 md:mb-0 text-center md:text-left">
      Empower your career with InternArea today
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <a href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 40 40">
        <svg viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47"></path>
            <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4"></path>
            <path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00">
                </path><polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"></polygon>
                <path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435"></path>
                <polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"></polygon>
                <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4"></path></g></svg>
        </svg>
        Sign in with Google
      </a>
      <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        Get Started
      </Link>
    </div>
  </div>
</div>

        </>
    );

}

export default Home


function sideScroll(element, direction,speed,distance,step){
    let scrollAmount=0;
    const slideTimer=setInterval(function(){
        if (direction==='left') {
            element.scrollLeft-=step
        }
        else{
            element.scrollLeft+=step
        }
        scrollAmount+=step;
        if(scrollAmount>=distance){
            window.clearInterval(slideTimer)
        }
    },speed)
}
function sideScrollIntern(element, direction,speed,distance,step){
    let scrollAmount=0;
    const slideTimer=setInterval(function(){
        if (direction==='left') {
            element.scrollLeft-=step
        }
        else{
            element.scrollLeft+=step
        }
        scrollAmount+=step;
        if(scrollAmount>=distance){
            window.clearInterval(slideTimer)
        }
    },speed)
}