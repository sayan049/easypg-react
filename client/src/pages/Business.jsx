

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, BarChart3, DollarSign, Bell, LineChart, Smartphone, CheckCircle, XCircle, Bus } from "lucide-react";
import Footer from '../components/footer';

const BusinessModel= () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-white py-12 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div
              className={`md:w-1/2 space-y-6 transition-all duration-700 transform ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Grow your PG business with ease
              </h1>
              <p className="text-lg text-gray-600">Join 150+ PG owners who simplified their operations with MessMate</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full transition-colors duration-300 flex items-center gap-2">
                See how it works
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div
              className={`md:w-1/2 transition-all duration-700 delay-300 transform ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746453085/img_2_vbbdmn.png"
                alt="PG business management dashboard"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-bold text-center mb-12 transition-all duration-500 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Everything you need to succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-bold text-center mb-12 transition-all duration-500 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            The MessMate Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className={`bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-500 transform ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-4 text-red-500 font-semibold">
                <XCircle size={20} />
                <span>Without MessMate</span>
              </div>
              <ul className="space-y-3">
                {withoutFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`bg-green-50 p-6 rounded-xl border border-green-200 transition-all duration-500 transform ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-4 text-green-500 font-semibold">
                <CheckCircle size={20} />
                <span>With MessMate</span>
              </div>
              <ul className="space-y-3">
                {withFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 bg-gray-50">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 transform ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="text-5xl text-blue-500 mb-6">"</div>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            "MessMate has transformed how I manage my PG. I've reduced my vacant rooms by 40% and saved countless hours
            on administration. It's the best investment I've made for my business."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Customer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-semibold">Rajesh Kumar</p>
              <p className="text-sm text-gray-500">PG Owner for 5+ years</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24 bg-blue-600 text-white text-center">
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow your PG business?</h2>
          <p className="text-blue-100 mb-8">Join the growing community of successful PG owners</p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-3 rounded-full transition-colors duration-300" onClick={() => navigate("/OurService")}>
            Explore Our Services
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Feature data
const features = [
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "Reach more students",
    description: "Get leads when students are searching that increase your visibility",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
    title: "Manage easily",
    description: "Update room statuses and create booking all in one interface",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-blue-500" />,
    title: "Earn more, 10 faster",
    description: "Track monthly payments and maintain complete payment records",
  },
  {
    icon: <Bell className="w-6 h-6 text-blue-500" />,
    title: "Get notified instantly",
    description: "Real-time alerts for all bookings, payments and inquiries",
  },
  {
    icon: <LineChart className="w-6 h-6 text-blue-500" />,
    title: "Insights to grow",
    description: "Detailed analytics of your rooms and income performance",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-blue-500" />,
    title: "Mobile friendly",
    description: "Manage your PG from anywhere using our mobile app",
  },
]

// Comparison data
const withoutFeatures = [
  "Manual record keeping and calculations",
  "Limited phone calls and inquiries",
  "Time consuming manual processes",
]

const withFeatures = ["Automated booking system", "24/7 online booking platform", "Real-time data and analytics"]
export default BusinessModel;