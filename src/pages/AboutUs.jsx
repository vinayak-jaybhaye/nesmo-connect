import React from "react";

function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-wide text-gray-100 mb-4">
              About NESMO Connect
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
          </div>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A premier platform bridging academic excellence and professional
            achievement through strategic connections between current students
            and distinguished alumni. Established under the auspices of
            <strong className="text-blue-400"> NESMO Foundation</strong>, we
            facilitate mentorship, career development, and educational
            advancement.
          </p>
        </div>

        {/* Mission Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-gray-100 border-l-4 border-blue-600 pl-4">
            Institutional Mission
          </h2>
          <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700/50 shadow-xl">
            <p className="text-gray-300 leading-relaxed text-lg">
              Since our establishment in 2010, NESMO Foundation has empowered
              over <strong className="text-blue-400">15,000 scholars</strong>
              through comprehensive support programs. NESMO Connect extends this
              legacy by creating structured pathways for professional
              development and academic collaboration.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-gray-100 border-l-4 border-blue-600 pl-4">
            Core Offerings
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Academic Mentorship",
                desc: "Structured guidance from industry professionals and alumni",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: "Career Development",
                desc: "Professional placement support and career counseling",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
                title: "Educational Resources",
                desc: "Curated academic materials and research databases",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                title: "Admissions Guidance",
                desc: "University application support and strategic planning",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 border border-gray-700/50 rounded-lg bg-gray-800/30 hover:border-blue-600/50 transition-colors"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-gray-800/50 p-12 rounded-lg border border-gray-700/50 shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-100 text-center mb-8">
            Institutional Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: "92%", label: "Higher Education Placement Rate" },
              { value: "₹4.2Cr+", label: "Scholarships Disbursed" },
              { value: "850+", label: "Corporate Partnerships" },
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="text-4xl font-bold text-blue-500">
                  {stat.value}
                </div>
                <div className="text-gray-300 uppercase text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-12">
          <h3 className="text-2xl font-semibold text-gray-100 mb-6">
            Join Our Academic Community
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Engage with a network of scholars, industry leaders, and academic
            professionals committed to educational excellence.
          </p>
          <button className="bg-blue-600/80 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors border border-blue-500/30 shadow-lg">
            Begin Your Journey
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
