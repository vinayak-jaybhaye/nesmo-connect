import React from 'react'

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-100">
            About Nesmo-Connect
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connecting <span className="text-indigo-400 font-medium">Students</span> and <span className="text-blue-400 font-medium">Alumni</span> to foster mentorship, career guidance, and educational support. Powered by <strong>NESMO NGO</strong>, we are building a brighter future together.
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <span className="h-1 w-8 bg-indigo-500"></span>
            <span className="h-1 w-8 bg-blue-500"></span>
          </div>
        </div>

        {/* Mission Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-100">
            Our Educational Mission
          </h2>
          <p className="text-gray-300 leading-relaxed bg-gray-800 p-6 rounded-lg border border-gray-700">
            Since 2010, NESMO NGO has supported over <strong>5,000 students</strong> through scholarships, mentoring, and educational programs. Nesmo-Connect enhances this by creating a <span className="text-indigo-400 font-semibold">bridge</span> between students and alumni, nurturing careers and lifelong learning.
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            {[
              {icon: '🎓', title: 'Mentorship', desc: '1:1 guidance from alumni in your field of study.'},
              {icon: '💼', title: 'Career Support', desc: 'Internships, resume help & interview tips.'},
              {icon: '📖', title: 'Study Resources', desc: 'Shared notes, scholarships & academic materials.'},
              {icon: '🤝', title: 'Alumni Network', desc: 'Connect with graduates in your career path.'},
              {icon: '🏫', title: 'University Guidance', desc: 'Admission counseling & entrance prep.'},
              {icon: '🌐', title: 'Global Community', desc: 'Join members from 25+ countries.'},
            ].map((item, index) => (
              <div key={index} className="p-5 border border-gray-700 rounded-lg bg-gray-850 hover:border-indigo-500 transition-colors duration-300">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg text-gray-100">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 text-center mb-6">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center text-gray-300">
            <div>
              <div className="text-4xl font-bold text-indigo-400">85%</div>
              <div>University Acceptance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400">1,200+</div>
              <div>Mentorship Matches</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-400">₹2.3 Cr+</div>
              <div>Scholarships Awarded</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-800 p-8 rounded-lg border border-indigo-500/30">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Join Our Mission
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Whether you’re a student seeking guidance or an alumni ready to give back, Nesmo-Connect is your platform to make a difference.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-indigo-500 transition">
            Join Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
