import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Settings,
  DollarSign,
  Bell,
  BarChart2,
  ArrowRight,
  CheckCircle,
  XCircle,
  Building,
  Star,
  FileCheck2
} from "lucide-react";
import Footer from "../components/footer";
import { Helmet } from "react-helmet";

const BusinessModel = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    benefits: false,
    comparison: false,
    testimonial: false,
    cta: false,
  });
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // Set initial visibility with slight delays for cascade effect
    const timer1 = setTimeout(
      () => setIsVisible((prev) => ({ ...prev, hero: true })),
      100
    );
    const timer2 = setTimeout(
      () => setIsVisible((prev) => ({ ...prev, benefits: true })),
      300
    );
    const timer3 = setTimeout(
      () => setIsVisible((prev) => ({ ...prev, comparison: true })),
      600
    );
    const timer4 = setTimeout(
      () => setIsVisible((prev) => ({ ...prev, testimonial: true })),
      900
    );
    const timer5 = setTimeout(
      () => setIsVisible((prev) => ({ ...prev, cta: true })),
      1200
    );

    // Set up scroll observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setIsVisible((prev) => ({ ...prev, [sectionId]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          PG Management Solution | MessMate - Boost Occupancy & Revenue
        </title>
        <meta
          name="description"
          content="Transform your PG business with MessMate's all-in-one management platform. Automate bookings, payments, and operations. Join 100+ PG owners seeing 40% growth."
        />
        <meta
          name="keywords"
          content="PG management software, hostel management system, student accommodation platform, PG owner solutions"
        />
        <link
          rel="canonical"
          href="https://www.messmate.co.in/business-model"
        />

        {/* Open Graph */}
        <meta property="og:title" content="PG Management Solution | MessMate" />
        <meta
          property="og:description"
          content="Automate PG operations & increase revenue with MessMate's complete management platform"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/og-business.jpg"
        />
        <meta
          property="og:url"
          content="https://www.messmate.co.in/business-model"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MessMate" />

        {/* Schema Markup */}
        {/* <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "PG Management Solution",
            description: "Complete PG management platform for hostel owners",
            publisher: {
              "@type": "Organization",
              name: "MessMate",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/companylogo_qz2ufw.png",
              },
              sameAs: [
                "https://facebook.com/messmate",
                "https://linkedin.com/company/messmate",
              ],
            },
            mainEntityOfPage: {
              "@type": "VideoObject",
              name: "MessMate Platform Demo",
              description: "See how MessMate transforms PG management",
              thumbnailUrl:
                "https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746629877/video-thumbnail.jpg",
              uploadDate: "2024-05-01",
              duration: "PT3M22S",
              contentUrl:
                "https://res.cloudinary.com/dlfwb6sqd/video/upload/v1746537432/720p_gn4q9l.mp4",
            },
          })}
        </script> */}
      </Helmet>
      <main className=" text-gray-800 overflow-x-hidden">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative bg-custom-gradient py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-hidden"
        >
          {/* <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            PG Management Software for Modern Hostel Owners
          </h1> */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <div
                className={`md:w-1/2 space-y-6 transition-all duration-1000 ease-out transform ${
                  isVisible.hero
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0"
                }`}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  Why Choose{" "}
                  <div className="inline-flex items-center text-5xl font-bold space-x-1">
                    <img
                      src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
                      alt="Messmate - Company Logo"
                      className="mr-[-4px]" // Adjust spacing between the image and text
                      loading="lazy"
                    />
                    <div className="text-3xl font-bold text-[#2CA4B5] mt-[20px] ml-[-10px]">
                      essMate
                    </div>
                  </div>
                  <div></div> for Your PG Business?
                </div>
                <p className="text-xl text-gray-600 max-w-lg">
                  Join 100+ PG owners who simplified their operations and grew
                  their business with MessMate.
                </p>{" "}
                {/* Trigger Button */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                  aria-label="Watch platform demo video"
                  aria-expanded={isOpen}
                >
                  See How It Works
                  <ArrowRight size={18} />
                </button>
                {/* Modal */}
                {isOpen && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                    {/* Overlay click to close */}
                    <div
                      className="absolute inset-0"
                      onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div
                      className="relative z-10 w-full max-w-3xl rounded-xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()} // prevent closing when clicking video
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-3 right-3 z-20 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                        aria-label="Close"
                      >
                        &times;
                      </button>

                      {/* Responsive Video */}
                      <div className="relative pt-[56.25%]">
                        <video
                          src="https://res.cloudinary.com/dlfwb6sqd/video/upload/v1746537432/720p_gn4q9l.mp4"
                          className="absolute top-0 left-0 w-full h-full"
                          controls
                          autoPlay
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/${
                            num % 2 === 0 ? "women" : "men"
                          }/${num * 10 + 10}.jpg`}
                          alt="User"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Trusted by 100+ PG owners
                  </p>
                </div>
              </div>

              <div
                className={`md:w-1/2 mt-8 md:mt-0 transition-all duration-1000 delay-300 ease-out transform ${
                  isVisible.hero
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0"
                }`}
              >
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-200 to-purple-100 rounded-xl transform rotate-2"></div>
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="MessMate PG management dashboard interface"
                    className="relative z-10 w-full h-auto rounded-xl shadow-xl"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-lg shadow-lg z-20 transform rotate-3">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle size={16} />
                      <span>Bookings up 40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Logos */}
            <div
              className={`mt-16 transition-all duration-700 ease-out transform ${
                isVisible.hero
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <p className="text-center text-gray-500 mb-4 text-sm uppercase tracking-wider">
                Trusted by PG owners across
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {["Kolkata", "Nadia", "kalyani"].map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-1 text-gray-400"
                  >
                    <Building size={18} />
                    <span className="font-medium">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div
              className={`text-center mb-16 transition-all duration-700 ease-out transform ${
                isVisible.benefits
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                MessMate provides all the tools you need to manage and grow your
                PG business efficiently.
              </p>
            </div>

            {/* Cards Wrapper */}
            <div
              className={`transition-all duration-700 ease-out transform ${
                isVisible.benefits
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <div
                className="
          flex md:grid
          md:grid-cols-2 lg:grid-cols-3
          gap-4
          overflow-x-auto md:overflow-visible
          scroll-smooth
          no-scrollbar
          pb-4 pr-4
        "
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`
              min-w-[80%] md:min-w-0 max-w-[80%] md:max-w-full w-full
              flex-shrink-0
              bg-white p-6 flex flex-col
              rounded-xl border-[1px] border-gray-300 shadow-lg hover:shadow-2xl
              transition-shadow duration-300 ease-in-out
              transform ${
                isVisible.benefits
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl flex items-center justify-center mb-5 shadow-lg hover:shadow-2xl">
                      {benefit.icon}
                    </div>

                    <h3 className="text-xl font-semibold mb-3 break-words">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 break-words">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section
          id="comparison"
          className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400"
        >
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-700 ease-out transform ${
                isVisible.comparison
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Before vs After{" "}
                <div className="inline-flex items-center text-5xl font-bold space-x-1">
                  <img
                    src="https://res.cloudinary.com/dlfwb6sqd/image/upload/v1746706292/companylogo-681c9f565d735_yorrie.webp"
                    alt="MessMate - company Logo"
                    loading="lazy"
                    className="mr-[-4px]" // Adjust spacing between the image and text
                  />
                  <div className="text-3xl font-bold text-[#2CA4B5] mt-[20px] ml-[-10px]">
                    essMate
                  </div>
                </div>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                See how MessMate transforms your PG business operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div
                className={`bg-white p-6 md:p-8 rounded-xl border border-red-100 hover:border-red-500 transition-all duration-700 ease-out transform ${
                  isVisible.comparison
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-12 opacity-0"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">
                    Without MessMate
                  </h3>
                </div>

                <div className="space-y-4">
                  {withoutFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-red-50 rounded-lg p-4">
                  <img
                    src="https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Messy paperwork"
                    className="w-full h-auto rounded-lg mb-4"
                    loading="lazy"
                  />
                  <p className="text-red-600 text-sm italic text-center">
                    Messy paperwork, missed calls, and confusion
                  </p>
                </div>
              </div>

              <div
                className={`bg-white p-6 md:p-8 rounded-xl border border-green-100 hover:border-green-500 transition-all duration-700 ease-out transform ${
                  isVisible.comparison
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600">
                    With MessMate
                  </h3>
                </div>

                <div className="space-y-4">
                  {withFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-green-50 rounded-lg p-4">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Organized dashboard"
                    className="w-full h-auto rounded-lg mb-4"
                    loading="lazy"
                  />
                  <p className="text-green-600 text-sm italic text-center">
                    Clean dashboard, organized data, and growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <article aria-labelledby="testimonial-heading">
          <h2 id="testimonial-heading" className="sr-only">
            Customer Testimonial
          </h2>
          <section
            id="testimonial"
            className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white"
          >
            <div className="max-w-5xl mx-auto">
              <div
                className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12 rounded-2xl shadow-sm transition-all duration-700 ease-out transform ${
                  isVisible.testimonial
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3 flex flex-col items-center md:items-start">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Testimonial"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h4 className="font-semibold text-lg">Rajesh Kumar</h4>
                      <p className="text-gray-600 text-sm">
                        PG Owner, Bangalore
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-current text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="text-4xl text-blue-400">"</div>
                    <p className="text-lg md:text-xl text-gray-700 mb-4">
                      MessMate has transformed how I manage my PG. I've reduced
                      my vacant rooms by 40% and saved countless hours on
                      administration. It's the best investment I've made for my
                      business.
                    </p>
                    <p className="text-gray-600 italic">
                      — Using MessMate for 1.5 years
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* CTA Section */}
        <section
          id="cta"
          className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
        >
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out transform ${
              isVisible.cta
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              Ready to grow your PG business?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join the growing community of successful PG owners who are
              transforming their business with MessMate.
            </p>
            <button
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
              onClick={() => navigate("/our-services")}
            >
              Explore Our Services
              <ArrowRight size={18} />
            </button>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-4 text-sm text-blue-100">
              <span>No credit card required</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
              <span>Free 30-day trial</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Benefits data
const benefits = [
  {
    icon: <FileCheck2 className="w-6 h-6 text-blue-500" />,
    title: "Automated Student Onboarding",
    description:
      "Streamline admissions with digital forms and document verification",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "Reach more students",
    description:
      "Get listed where students are searching that increase your visibility and occupancy rates.",
  },
  {
    icon: <Settings className="w-6 h-6 text-blue-500" />,
    title: "Manage easily",
    description:
      "Update room statuses and create bookings all in one intuitive interface.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-blue-500" />,
    title: "Earn more, fill faster",
    description:
      "Reduce vacancy periods and increase your monthly revenue with smart pricing.",
  },
  {
    icon: <Bell className="w-6 h-6 text-blue-500" />,
    title: "Get notified instantly",
    description:
      "Real-time alerts for all bookings, payments, and inquiries so you never miss out.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
    title: "Insights to grow",
    description:
      "Detailed analytics of your rooms and income performance to make data-driven decisions.",
  },
  {
    icon: <Star className="w-6 h-6 text-blue-500" />,
    title: "Build your reputation",
    description:
      "Collect and showcase reviews from satisfied tenants to attract more customers.",
  },
];

// Comparison data
const withoutFeatures = [
  "Manual record keeping in spreadsheets",
  "Missed calls and lost potential customers",
  "Time-consuming rent collection process",
  "No visibility into business performance",
  "Difficulty tracking maintenance requests",
];

const withFeatures = [
  "Automated digital record management",
  "24/7 online booking platform",
  "Streamlined payment collection system",
  "Real-time analytics and reporting",
  "Organized maintenance request tracking",
];
export default BusinessModel;
