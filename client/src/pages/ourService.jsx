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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4">
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
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center relative"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl flex flex-col justify-end p-6 md:p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-center"
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

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          font-family: "Inter", sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .font-inter {
          font-family: "Inter", sans-serif;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tailwind-like utility classes */
        .min-h-screen {
          min-height: 100vh;
        }
        .bg-white {
          background-color: white;
        }
        .bg-gray-50 {
          background-color: #f9fafb;
        }
        .bg-gray-900 {
          background-color: #111827;
        }
        .text-white {
          color: white;
        }
        .text-gray-400 {
          color: #9ca3af;
        }
        .text-gray-500 {
          color: #6b7280;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .text-gray-700 {
          color: #374151;
        }
        .text-gray-800 {
          color: #1f2937;
        }
        .text-blue-500 {
          color: #3b82f6;
        }
        .text-blue-600 {
          color: #2563eb;
        }
        .text-purple-500 {
          color: #8b5cf6;
        }
        .text-green-500 {
          color: #10b981;
        }
        .text-green-800 {
          color: #065f46;
        }
        .text-orange-500 {
          color: #f97316;
        }
        .text-yellow-400 {
          color: #facc15;
        }
        .bg-blue-50 {
          background-color: #eff6ff;
        }
        .bg-green-100 {
          background-color: #d1fae5;
        }
        .bg-white\/10 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .from-blue-50 {
          --tw-gradient-from: #eff6ff;
        }
        .to-purple-50 {
          --tw-gradient-to: #f5f3ff;
        }
        .from-blue-600 {
          --tw-gradient-from: #2563eb;
        }
        .to-purple-600 {
          --tw-gradient-to: #9333ea;
        }
        .from-white {
          --tw-gradient-from: white;
        }
        .to-gray-50 {
          --tw-gradient-to: #f9fafb;
        }
        .from-black\/70 {
          --tw-gradient-from: rgba(0, 0, 0, 0.7);
        }
        .via-transparent {
          --tw-gradient-via: transparent;
        }
        .to-transparent {
          --tw-gradient-to: transparent;
        }
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .bg-gradient-to-b {
          background-image: linear-gradient(
            to bottom,
            var(--tw-gradient-stops)
          );
        }
        .bg-gradient-to-t {
          background-image: linear-gradient(to top, var(--tw-gradient-stops));
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          color: transparent;
        }
        .font-bold {
          font-weight: 700;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-medium {
          font-weight: 500;
        }
        .text-xs {
          font-size: 0.75rem;
        }
        .text-sm {
          font-size: 0.875rem;
        }
        .text-lg {
          font-size: 1.125rem;
        }
        .text-xl {
          font-size: 1.25rem;
        }
        .text-2xl {
          font-size: 1.5rem;
        }
        .text-3xl {
          font-size: 1.875rem;
        }
        .text-4xl {
          font-size: 2.25rem;
        }
        .text-5xl {
          font-size: 3rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        .py-4 {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
        .py-6 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }
        .py-8 {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        .py-12 {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
        .py-16 {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        .py-24 {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        .px-2 {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
        .pt-8 {
          padding-top: 2rem;
        }
        .pb-6 {
          padding-bottom: 1.5rem;
        }
        .p-2 {
          padding: 0.5rem;
        }
        .p-3 {
          padding: 0.75rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .p-8 {
          padding: 2rem;
        }
        .p-12 {
          padding: 3rem;
        }
        .m-2 {
          margin: 0.5rem;
        }
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .mb-3 {
          margin-bottom: 0.75rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .mb-8 {
          margin-bottom: 2rem;
        }
        .mb-12 {
          margin-bottom: 3rem;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .mt-8 {
          margin-top: 2rem;
        }
        .mt-12 {
          margin-top: 3rem;
        }
        .ml-auto {
          margin-left: auto;
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .gap-4 {
          gap: 1rem;
        }
        .gap-6 {
          gap: 1.5rem;
        }
        .gap-8 {
          gap: 2rem;
        }
        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        .rounded-md {
          border-radius: 0.375rem;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .rounded-xl {
          border-radius: 0.75rem;
        }
        .rounded-2xl {
          border-radius: 1rem;
        }
        .rounded-full {
          border-radius: 9999px;
        }
        .border {
          border-width: 1px;
        }
        .border-t {
          border-top-width: 1px;
        }

        .border-dashed {
          border-style: dashed;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
        .border-gray-800 {
          border-color: #1f2937;
        }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .hover\:shadow-md:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .hover\:shadow-lg:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .hover\:bg-blue-50:hover {
          background-color: #eff6ff;
        }
        .hover\:text-white:hover {
          color: white;
        }
        .flex {
          display: flex;
        }
        .grid {
          display: grid;
        }
        .hidden {
          display: none;
        }
        .h-4 {
          height: 1rem;
        }
        .h-5 {
          height: 1.25rem;
        }
        .h-6 {
          height: 1.5rem;
        }
        .h-7 {
          height: 1.75rem;
        }
        .h-8 {
          height: 2rem;
        }
        .h-10 {
          height: 2.5rem;
        }
        .h-full {
          height: 100%;
        }
        .h-\[200px\] {
          height: 200px;
        }
        .h-\[300px\] {
          height: 300px;
        }
        .min-h-screen {
          min-height: 100vh;
        }
        .w-4 {
          width: 1rem;
        }
        .w-5 {
          width: 1.25rem;
        }
        .w-6 {
          width: 1.5rem;
        }
        .w-8 {
          width: 2rem;
        }
        .w-10 {
          width: 2.5rem;
        }
        .w-full {
          width: 100%;
        }
        .min-w-\[280px\] {
          min-width: 280px;
        }
        .max-w-2xl {
          max-width: 42rem;
        }
        .max-w-4xl {
          max-width: 56rem;
        }
        .flex-1 {
          flex: 1 1 0%;
        }
        .flex-col {
          flex-direction: column;
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .items-start {
          align-items: flex-start;
        }
        .items-center {
          align-items: center;
        }
        .justify-center {
          justify-content: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .overflow-hidden {
          overflow: hidden;
        }
        .overflow-x-auto {
          overflow-x: auto;
        }
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rounded {
          border-radius: 0.25rem;
        }
        .object-cover {
          object-fit: cover;
        }
        .text-center {
          text-align: center;
        }
        .text-left {
          text-align: left;
        }
        .font-inter {
          font-family: "Inter", sans-serif;
        }
        .opacity-50 {
          opacity: 0.5;
        }
        .opacity-90 {
          opacity: 0.9;
        }
        .shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        .outline-none {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .transition-colors {
          transition-property: color, background-color, border-color,
            text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .ease-out {
          transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
        .transform {
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }
        .translate-x-1\/2 {
          --tw-translate-x: 50%;
        }
        .translate-x-px {
          --tw-translate-x: 1px;
        }
        .-translate-x-1\/2 {
          --tw-translate-x: -50%;
        }
        .-translate-y-1\/2 {
          --tw-translate-y: -50%;
        }
        .rotate-180 {
          --tw-rotate: 180deg;
        }
        .backdrop-blur-sm {
          --tw-backdrop-blur: blur(4px);
          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
            var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
            var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
            var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
            var(--tw-backdrop-sepia);
        }
        .relative {
          position: relative;
        }
        .absolute {
          position: absolute;
        }
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .inset-y-0 {
          top: 0;
          bottom: 0;
        }
        .top-1\/2 {
          top: 50%;
        }
        .right-0 {
          right: 0;
        }
        .right-1 {
          right: 0.25rem;
        }
        .right-3 {
          right: 0.75rem;
        }
        .bottom-0 {
          bottom: 0;
        }
        .left-0 {
          left: 0;
        }
        .z-10 {
          z-index: 10;
        }
        .z-20 {
          z-index: 20;
        }
        .col-span-1 {
          grid-column: span 1 / span 1;
        }
        .col-span-2 {
          grid-column: span 2 / span 2;
        }
        .col-span-3 {
          grid-column: span 3 / span 3;
        }
        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .grid-cols-5 {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .flex-row {
          flex-direction: row;
        }
        .justify-end {
          justify-content: flex-end;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }

        @media (min-width: 640px) {
          .sm\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .sm\:flex {
            display: flex;
          }
        }

        @media (min-width: 768px) {
          .md\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .md\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .md\:flex-row {
            flex-direction: row;
          }
          .md\:w-1\/2 {
            width: 50%;
          }
          .md\:block {
            display: block;
          }
          .md\:hidden {
            display: none;
          }
          .md\:text-3xl {
            font-size: 1.875rem;
          }
          .md\:text-4xl {
            font-size: 2.25rem;
          }
          .md\:text-5xl {
            font-size: 3rem;
          }
          .md\:text-xl {
            font-size: 1.25rem;
          }
          .md\:py-16 {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
          .md\:py-24 {
            padding-top: 6rem;
            padding-bottom: 6rem;
          }
          .md\:p-8 {
            padding: 2rem;
          }
          .md\:p-12 {
            padding: 3rem;
          }
          .md\:gap-4 {
            gap: 1rem;
          }
          .md\:min-w-\[320px\] {
            min-width: 320px;
          }
          .md\:mb-0 {
            margin-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .lg\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .lg\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default OurService;
