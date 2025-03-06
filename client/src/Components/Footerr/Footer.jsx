import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          {/** First Column */}
          <div>
            <h3 className="text-sm font-bold">Internship by Places</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['San Francisco','Los Angeles','New York', 'Chicago', 'Miami', 'Seattle'].map((city) => (
                <p key={city} className="hover:underline hover:text-blue-600">{city}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">About Us</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Media Kit','Our Story','Careers','Contact', 'Press', 'News',].map((item) => (
                <p key={item} className="hover:underline hover:text-blue-600">{item}</p>
              ))}
            </div>
          </div>

          {/** Second Column */}
          <div>
            <h3 className="text-sm font-bold">Internship by Stream</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Content Writing','Engineering', 'Marketing', 'Finance', 'Design', 'Law'].map((item) => (
                <p key={item} className="hover:underline hover:text-blue-600">{item}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Job Places</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Help Center','Newsletter', 'Tutorials', 'Support','Events','Blog'].map((item) => (
                <a key={item} href="/" className="hover:underline hover:text-blue-600">{item}</a>
              ))}
            </div>
          </div>

          {/** 
           * Third Column */}
           <div>
            <h3 className="text-sm font-bold">Jobs by Streams</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Government', 'Marketplaces','Enterprise',  'E-commerce','Startups','SaaS'].map((item) => (
                <a key={item} href="/" className="hover:underline hover:text-blue-600">{item}</a>
              ))}
            </div>
          </div>
          
        
          <div>
            <h3 className="text-sm font-bold">Terms & Conditions</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Code of Conduct', 'User Agreement','Privacy Policy'].map((item) => (
                <a key={item} href="/" className="hover:underline hover:text-blue-600">{item}</a>
              ))}
            </div>
          </div>

          {/** Fourth Column */}
          <div>
            <h3 className="text-sm font-bold">Team Diary</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {[ 'Work Ethics','Culture', 'Events', 'Blogs'].map((item) => (
                <p key={item} className="hover:underline hover:text-blue-600">{item}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold">Sitemap</h3>
            <div className="flex flex-col items-start mt-4 space-y-2">
              {['Home', 'Internships', 'Jobs', 'Courses'].map((item) => (
                <a key={item} href="/" className="hover:underline hover:text-blue-600">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <i className="bi bi-google-play mr-2"></i>
              Get Android App
            </button>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <i className="fab fa-facebook text-xl cursor-pointer hover:text-blue-500"></i>
            <i className="fab fa-twitter text-xl cursor-pointer hover:text-blue-400"></i>
            <i className="fab fa-instagram text-xl cursor-pointer hover:text-pink-500"></i>
          </div>
          <p className="mt-4 text-sm sm:mt-0">© 2023. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
