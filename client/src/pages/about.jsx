import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  DollarSign,
  MapPin,
  Search,
  Eye,
  Send,
  CheckSquare,
  Target,
  Smartphone,
  CreditCard,
  Map,
  X,
  Home,
  Phone,
  Briefcase,
} from "lucide-react";
import { Helmet } from "react-helmet";

const About = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About MessMate | Verified Student PG & Mess Finder</title>
        <meta
          name="description"
          content="MessMate helps students find and book verified PGs, hostels, and mess services near their university or any location in India."
        />
        <meta
          name="keywords"
          content="student PG, hostel booking, mess services, student accommodation, verified PGs, MessMate"
        />
        <meta name="author" content="MessMate Team" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="About MessMate | Verified Student PG & Mess Finder"
        />
        <meta
          property="og:description"
          content="Helping students easily discover verified accommodations near universities."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />
        <meta property="og:url" content="https://www.messmate.co.in/about" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About MessMate | Verified Student PG & Mess Finder"
        />
        <meta
          name="twitter:description"
          content="Helping students easily discover verified accommodations near universities."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746794665/main-681df86fe504d_ltnvdn.webp"
        />

        {/* Script Tag Example (e.g., Google Analytics or a chatbot) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MessMate",
            url: "https://www.messmate.co.in/about",
            logo: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp",
            sameAs: [
              "https://www.linkedin.com/company/messmate",
              "https://twitter.com/messmate",
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white ">
        {/* Navigation */}
        <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-2xl font-bold flex items-center">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
                alt="MessMate - company Logo"
                className="w-8 h-8 mr-2"
                loading="lazy"
              />
              <span className="text-[#2CA4B5] ml-[-7px] mt-[7px]">essMate</span>
            </h1>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-[#2ca4b5]">
                Home
              </Link>
              <Link
                to="/#services"
                className="text-gray-600 hover:text-[#2ca4b5]"
              >
                Services
              </Link>

              <Link
                to="/#contactus"
                className="text-gray-600 hover:text-[#2ca4b5]"
              >
                Contact
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-52 bg-white z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="absolute top-2 right-1"
          >
            <X className="h-6 w-6 text-gray-600 hover:text-[#2ca4b5]  " />
          </button>

          <div className="flex flex-col p-4 space-y-6 mt-12">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#2ca4b5]"
              onClick={() => setIsOpen(false)}
            >
              <Home className="inline mr-4 text-[#2ca4b5]" /> Home
            </Link>
            <Link
              to="/#services"
              className="text-gray-600 hover:text-[#2ca4b5]"
              onClick={() => setIsOpen(false)}
            >
              <Briefcase className="inline mr-4 text-[#2ca4b5]" /> Services
            </Link>

            <Link
              to="/#contactus"
              className="text-gray-600 hover:text-[#2ca4b5]"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="inline mr-4 text-[#2ca4b5]" />
              Contact Us
            </Link>
          </div>
        </div>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
                Welcome to{" "}
                <img
                  src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
                  alt="MessMate - company Logo"
                  className="mr-[-4px] mt-[-15px] ml-2"
                  width={45}
                  loading="lazy"
                />
                <span className="text-2xl text-[#2CA4B5] mt-[10px] ml-[2px]">
                  essMate
                </span>
              </h1>
              <p className="text-gray-600 mb-6 max-w-md">
                Finding the perfect accommodation shouldn't be a hassle. We help
                students discover and book verified PGs, hostels, and mess
                services near universities.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746976366/img-3-6820bdcb4bc46_mxh4ym.webp"
                alt="Students using MessMate"
                width={500}
                height={400}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Our Story
          </h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746976367/img-4-6820bdefb7efd_us3iqz.webp"
                alt="Students studying"
                width={400}
                height={300}
                className="w-full h-auto mt-8"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <p className="text-gray-600 mb-6">
                As former students, we experienced firsthand the challenges of
                finding reliable accommodation. The endless searches, unreliable
                listings, and lack of transparency inspired us to create
                MessMate.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-[#2ca4b5]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>Started in 2024 with a simple idea</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-[#2ca4b5]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>Now helping thousands of students</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 mt-1 text-[#2ca4b5]">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>Present in 2+ major university cities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes MessMate Different */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            What Makes MessMate Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Booking</h3>
              <p className="text-gray-600 text-sm">
                Instant confirmation and hassle-free booking process
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600 text-sm">
                Every property is personally verified by our team
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">
                No hidden fees or surprise charges
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Local Discovery</h3>
              <p className="text-gray-600 text-sm">
                Find accommodations near your campus
              </p>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-[#2ca4b5]" />
                </div>
                <h3 className="text-xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To revolutionize student accommodation by making it easier,
                safer, and more transparent for students to find their perfect
                living space.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <Eye className="w-5 h-5 text-[#2ca4b5]" />
                </div>
                <h3 className="text-xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                To become the most trusted platform for student accommodation
                across India, serving millions of students in their journey.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Browse</h3>
              <p className="text-gray-600 text-sm">
                Search through verified listings near your university
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">View Details</h3>
              <p className="text-gray-600 text-sm">
                Check photos, amenities, and reviews
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Send Request</h3>
              <p className="text-gray-600 text-sm">
                Submit your booking request
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Get Confirmation</h3>
              <p className="text-gray-600 text-sm">
                Receive instant booking confirmation
              </p>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="flex overflow-x-auto space-x-8">
            {[
              {
                name: "Sayan Patra",
                title: "Founder & CEO",
                description: "Full Stack Developer",
                img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748291321/IMG20231025064623_quhilt.webp",
              },
              {
                name: "Rishi Saha",
                title: "Co-founder & CTO",
                description: "Full Stack Developer",
                img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748292073/Gemini_Generated_Image_jt8n56jt8n56jt8n_1_o6ykwu.webp",
              },
              {
                name: "Sandip Hembram",
                title: "Co-founder & CMO",
                description: "UI and UX Designer",
                img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748291268/WhatsApp_Image_2025-05-24_at_12.06.04_AM_tni4ek.webp",
              },
              {
                name: "Tanmoy Sarkar",
                title: "Co-founder & COO",
                description: "Android Developer",
                img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748291252/aaaa_evhrhz.webp",
              },
              {
                name: "Achintya Barman",
                title: "Marketing Specialist",
                description:
                  "Focuses on digital and physical marketing campaigns",
                img: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1748508974/whatsapp-image-2024-08-16-at-104043-3e17a943-photoroom-683820dddce06_bhvku7.webp",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center min-w-[200px]"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-light mb-4 hover:border-primary-dark transition-colors duration-200">
                  <img
                    src={member.img}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-[#2ca4b5] mb-1">{member.title}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What's Next */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 flex items-center justify-center">
            What's Next for{" "}
            <img
              src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
              alt="MessMate - company Logo"
              className="mr-[-4px] mt-[-15px] ml-2"
              width={45}
              loading="lazy"
            />
            <span className="text-2xl text-[#2CA4B5] mt-[10px] ml-[2px]">
              essMate
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">Mobile App Launch</h3>
              <p className="text-gray-600 text-sm">
                Coming soon to iOS and Android
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">UPI Integration</h3>
              <p className="text-gray-600 text-sm">
                Seamless payment experience
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-[#2ca4b5]" />
              </div>
              <h3 className="font-semibold mb-2">More Cities</h3>
              <p className="text-gray-600 text-sm">
                Expanding to 20+ new cities
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        {/* <footer className="bg-gray-50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#2ca4b5] font-bold text-xl flex items-center mb-4 md:mb-0">
              <div className="w-6 h-6 bg-teal-500 rounded-md flex items-center justify-center mr-2">
                <span className="text-white text-xs">🏠</span>
              </div>
              MessMate
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-[#2ca4b5]">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#2ca4b5]">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#2ca4b5]">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">© 2025 MessMate. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
      </div>
    </>
  );
};
export default About;
