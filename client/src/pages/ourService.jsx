import { useEffect, useRef } from "react";
import {
  Home,
  Search,
  CheckCircle,
  CreditCard,
  BarChart3,
  Bed,
  ImageIcon,
  Bell,
  LayoutDashboard,
  FileText,
  Wrench,
  MessageCircle,
  FileQuestion,
  Wallet,
  FileIcon,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

const OurService = () => {
  const observerRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observerRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen font-inter text-gray-800">
      {/* Header Section */}
      <header
        className="container mx-auto px-4 py-16 md:py-24 text-center"
        ref={addToRefs}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          How MessMate Empowers PG Owners
        </h1>
        <h2 className="text-xl md:text-3xl font-semibold mb-4">
          Your all-in-one PG management toolkit
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          MessMate makes running your PG smooth and stress-free.
        </p>
      </header>

      {/* Step-by-Step Workflow */}
      <section
        className="container mx-auto px-4 py-12 md:py-16"
        ref={addToRefs}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Simple Workflow to Get Started
        </h2>
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 overflow-x-auto pb-6 md:overflow-visible md:pb-0 snap-x gap-4 md:gap-6">
          {[
            {
              icon: <Home className="h-10 w-10 text-blue-500" />,
              title: "List your PG",
              description: "Upload photos, price, amenities",
            },
            {
              icon: <Search className="h-10 w-10 text-purple-500" />,
              title: "Get discovered",
              description: "Students find and view your PG",
            },
            {
              icon: <CheckCircle className="h-10 w-10 text-green-500" />,
              title: "Approve bookings",
              description: "Accept or reject with one click",
            },
            {
              icon: <CreditCard className="h-10 w-10 text-orange-500" />,
              title: "Track payments",
              description: "(Feature coming soon)",
            },
            {
              icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
              title: "Monitor performance",
              description: "Know what's working",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="min-w-[280px] md:min-w-0 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center relative snap-start"
              ref={addToRefs}
            >
              <div className="mb-4 bg-gray-50 p-4 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < 4 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16"
        ref={addToRefs}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Feature Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Bed />, title: "Room & bed management" },
              { icon: <ImageIcon />, title: "Upload photos & update info" },
              { icon: <Bell />, title: "Real-time notifications" },
              { icon: <LayoutDashboard />, title: "Dashboard with analytics" },
              { icon: <FileText />, title: "Download invoices" },
              { icon: <Wrench />, title: "Maintenance request handling" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
                ref={addToRefs}
              >
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Support Section */}
      <section
        className="container mx-auto px-4 py-12 md:py-16"
        ref={addToRefs}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Owner Support
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-blue-500" />
                <span>24/7 chat and phone support</span>
              </li>
              <li className="flex items-center gap-3">
                <FileQuestion className="h-6 w-6 text-blue-500" />
                <span>Documentation and onboarding help</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 relative h-[300px] w-full">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              alt="Customer support illustration"
              className="rounded-lg shadow-md object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Visual Mockups */}
      <section className="bg-gray-50 py-12 md:py-16" ref={addToRefs}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Dashboard Preview
          </h2>
          <div className="relative max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              alt="MessMate Dashboard"
              className="rounded-xl shadow-lg object-cover w-full h-auto"
            />
            <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl flex-col justify-end p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Pending Bookings</h3>
                  <p className="text-sm opacity-90">
                    Manage all your booking requests in one place
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Room Editing</h3>
                  <p className="text-sm opacity-90">
                    Update room details and availability
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Reports</h3>
                  <p className="text-sm opacity-90">
                    Get insights on occupancy and performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Coming Soon */}
      <section
        className="container mx-auto px-4 py-12 md:py-16"
        ref={addToRefs}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What's Coming Soon
        </h2>
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto pb-6 md:overflow-visible md:pb-0 snap-x gap-4 md:gap-6">
          {[
            {
              icon: <Wallet className="h-8 w-8 text-purple-500" />,
              title: "UPI payments",
              description: "Accept payments directly through the platform",
            },
            {
              icon: <FileIcon className="h-8 w-8 text-blue-500" />,
              title: "Auto-invoicing",
              description: "Generate and send invoices automatically",
            },
            {
              icon: <Mail className="h-8 w-8 text-green-500" />,
              title: "Automated reminder emails",
              description: "Send payment and booking reminders",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="min-w-[280px] md:min-w-0 border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-center snap-start"
              ref={addToRefs}
            >
              <div className="mb-4 bg-gray-50 p-4 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PG Showcase */}
      <section className="py-12 md:py-16 overflow-hidden" ref={addToRefs}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            PGs on MessMate
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
            {[
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
            ].map((img, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-[320px] snap-start rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`PG example ${index + 1}`}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="font-semibold">Comfort PG {index + 1}</h3>
                  <p className="text-sm text-gray-500">Delhi, India</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-medium">
                      ₹8,000/month
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {index % 2 === 0 ? "Available" : "80% Full"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16"
        ref={addToRefs}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Trusted by PG Owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "MessMate has simplified my PG management. I can now focus on providing better service to my tenants.",
                author: "Rahul S.",
                role: "Owner of Sunshine PG",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                quote:
                  "The booking system is seamless. I've seen a 40% increase in occupancy since using MessMate.",
                author: "Priya M.",
                role: "Owner of Comfort Stay",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                quote:
                  "The dashboard gives me all the insights I need to make better business decisions.",
                author: "Vikram J.",
                role: "Owner of Student Haven",
                avatar: "https://randomuser.me/api/portraits/men/68.jpg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
                ref={addToRefs}
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24"
        ref={addToRefs}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Join hundreds of successful PG owners
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Start managing smarter with MessMate and transform your PG business
            today.
          </p>
          <button
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            onClick={() => navigate("/LoginOwner")}
          >
            Continue to Free Signup
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <CheckCircle2 className="h-5 w-5 text-green-300" />
                <span className="text-sm">Trusted by {100 * i}+ owners</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurService;
