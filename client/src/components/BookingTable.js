// import React from "react";
// import { FaDownload } from "react-icons/fa";
// import { HiOutlineLocationMarker } from "react-icons/hi";
// import { FaBed, FaRupeeSign } from "react-icons/fa";
// import { MdOutlineWifi, MdOutlineKitchen, MdOutlinePower, MdTv, MdOutlineAcUnit } from "react-icons/md";
// import { MdOutlineAccessTime, MdOutlineHome, MdOutlineHistory } from "react-icons/md";
// import { FaCalendarAlt, FaEye } from "react-icons/fa";

// const BookingTable = () => {
//   const bookings = [
//     {
//       id: "#MB01234",
//       name: "Sunshine PG",
//       date: "Apr 15, 2025",
//       amount: "₹15,000",
//       status: "Confirmed",
//       action: "Download",
//     },
//     {
//       id: "#MB01235",
//       name: "Green View PG",
//       date: "Apr 10, 2025",
//       amount: "₹12,000",
//       status: "Pending",
//       action: "View",
//     },
//     {
//       id: "#MB01236",
//       name: "College Hub PG",
//       date: "Apr 5, 2025",
//       amount: "₹13,500",
//       status: "Rejected",
//       action: "View",
//     },
//   ];

//   const statusColors = {
//     Confirmed: "text-green-700 bg-green-100",
//     Pending: "text-yellow-700 bg-yellow-100",
//     Rejected: "text-red-700 bg-red-100",
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-8 lg:px-6 xl:px-4 py-4  mx-auto">

//       {/* Booking Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
//         <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
//           <div className="text-left">
//             <p className="text-sm text-gray-500">Upcoming Bookings</p>
//             <h2 className="text-2xl font-bold text-blue-600">2</h2>
//           </div>
//           <MdOutlineAccessTime className="text-3xl text-blue-500" />
//         </div>
//         <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
//           <div className="text-left">
//             <p className="text-sm text-gray-500">Active Stay</p>
//             <h2 className="text-2xl font-bold text-green-600">1</h2>
//           </div>
//           <MdOutlineHome className="text-3xl text-green-500" />
//         </div>
//         <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
//           <div className="text-left">
//             <p className="text-sm text-gray-500">Past Bookings</p>
//             <h2 className="text-2xl font-bold text-purple-600">5</h2>
//           </div>
//           <MdOutlineHistory className="text-3xl text-purple-500" />
//         </div>
//       </div>

//       {/* Current Accommodation */}
//       <div className="bg-white shadow-md p-4 rounded-xl mb-6">
//         <h3 className="text-lg font-semibold mb-2">Current Accommodation</h3>
//         <h2 className="text-xl font-bold">Sunshine PG</h2>
//         <div className="flex items-center text-sm text-gray-600 mt-1">
//           <HiOutlineLocationMarker className="mr-1" />
//           123 College Street, Tech Park
//         </div>
//         <p className="text-sm text-gray-600">Girls PG</p>
//         <div className="flex items-center text-sm text-gray-600 mt-1">
//           <FaBed className="mr-1" />
//           Room 204
//         </div>
//         <div className="flex items-center text-sm text-gray-600 mt-1">
//           <FaRupeeSign className="mr-1" />
//           15,000/month
//         </div>
//         <div className="mt-4">
//           <p className="font-semibold mb-2">Amenities</p>
//           <div className="flex flex-wrap gap-2 text-sm text-gray-700">
//             <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineAcUnit /> AC</span>
//             <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdTv /> TV</span>
//             <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlinePower /> Power Backup</span>
//             <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineWifi /> WiFi</span>
//             <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><MdOutlineKitchen /> Kitchen</span>
//           </div>
//         </div>
//       </div>

//       {/* Booking History Table (desktop) */}
//       <div className="hidden md:block bg-white shadow-md p-4 rounded-xl mb-6">
//         <h3 className="text-lg font-semibold mb-4">Booking History</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr className="text-left text-sm font-semibold text-gray-700">
//                 <th className="py-2">Booking ID</th>
//                 <th className="py-2">Accommodation</th>
//                 <th className="py-2">Date</th>
//                 <th className="py-2">Amount</th>
//                 <th className="py-2">Status</th>
//                 <th className="py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm text-gray-800">
//               {bookings.map((booking, index) => (
//                 <tr key={index} className="border-t border-gray-100">
//                   <td className="py-2">{booking.id}</td>
//                   <td className="py-2">{booking.name}</td>
//                   <td className="py-2">{booking.date}</td>
//                   <td className="py-2">{booking.amount}</td>
//                   <td className="py-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
//                   </td>
//                   <td className="py-2">
//                     {booking.action === "Download" ? (
//                       <button className="text-blue-600 flex items-center gap-1"><FaDownload /> Download</button>
//                     ) : (
//                       <button className="text-blue-600 flex items-center gap-1"><FaEye /> View</button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Booking History Cards (mobile-friendly) */}
//       <div className="md:hidden bg-white shadow-md p-4 rounded-xl mb-6">
//         <h3 className="text-lg font-semibold mb-4">Booking History</h3>
//         <div className="space-y-4">
//           {bookings.map((booking, index) => (
//             <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs text-gray-500">Booking ID: {booking.id.slice(-4)}</p>
//                   <h4 className="text-md font-semibold">{booking.name}</h4>
//                 </div>
//                 <span className={`text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
//               </div>
//               <div className="mt-2 text-sm text-gray-700">
//                 <div className="flex items-center gap-2">
//                   <FaCalendarAlt className="text-gray-400" />
//                   {booking.date}
//                 </div>
//                 <div className="mt-1">{booking.amount}</div>
//               </div>
//               {booking.action === "Download" ? (
//                 <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
//                   <FaDownload /> Download Invoice
//                 </button>
//               ) : (
//                 <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
//                   <FaEye /> View Details
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingTable;
// //       </span>
// //       {status} 
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  FaDownload, FaRupeeSign, FaBed, 
  FaCalendarAlt, FaEye 
} from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { 
  MdOutlineAccessTime, MdOutlineHistory 
} from "react-icons/md";
import axios from 'axios';
import { baseurl } from '../constant/urls';
import { toast } from 'react-toastify';


const BookingTable = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStay, setCurrentStay] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const statusColors = {
    confirmed: "text-green-700 bg-green-100",
    pending: "text-yellow-700 bg-yellow-100",
    rejected: "text-red-700 bg-red-100",
    cancelled: "text-gray-700 bg-gray-100"
  };
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = useCallback(async (page = 1,status='') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${baseurl}/auth/bookings/user-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          
          page,
          limit: pagination.limit,
          ...(status && { status })
        }
      });

      if (response.data) {
        const now = new Date();
        const bookingsWithDates = response.data.bookings.map(booking => {
          const endDate = new Date(booking.period.startDate);
          endDate.setMonth(endDate.getMonth() + booking.period.durationMonths);
          
          return {
            ...booking,
            period: {
              ...booking.period,
              endDate
            }
          };
        });

        setBookings(bookingsWithDates);
        setCurrentStay(
          bookingsWithDates.find(
            b => b.status === 'confirmed' && 
                 new Date(b.period.startDate) <= now && 
                 now <= new Date(b.period.endDate)
          )
        );
        setPagination(prev => ({
          ...prev,
          page,
          total: response.data.total
        }));
        setError(null);
      }
    } catch (err) {
      console.error('Booking fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
      toast.error(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, [user?._id, fetchBookings]);

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const token = localStorage.getItem('accessToken');
      toast.info('Preparing your invoice...', { autoClose: 2000 });
      
      const response = await axios.get(`${baseurl}/auth/bookings/${bookingId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Invoice download error:', err);
      toast.error(err.response?.data?.message || 'Failed to download invoice');
    }
  };

  const bookingStats = React.useMemo(() => {
    const now = new Date();
    return {
      upcoming: bookings.filter(
        b => b.status === 'confirmed' && new Date(b.period.startDate) > now
      ).length,
      past: bookings.filter(
        b => new Date(b.period.endDate) < now
      ).length
    };
  }, [bookings]);

  if (loading && !bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !bookings.length) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-red-600">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchBookings()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loading && !bookings.length) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">No Bookings</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Browse Accommodations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-6 xl:px-4 py-4 mx-auto">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchBookings(1, e.target.value);
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mb-6">
        <StatCard 
          icon={<MdOutlineAccessTime className="text-3xl text-blue-500" />}
          label="Upcoming Bookings"
          value={bookingStats.upcoming}
          color="text-blue-600"
        />
        <StatCard 
          icon={<MdOutlineHistory className="text-3xl text-purple-500" />}
          label="Past Bookings"
          value={bookingStats.past}
          color="text-purple-600"
        />
      </div>

      {/* Current Stay */}
      {currentStay && <CurrentStayCard booking={currentStay} />}

      {/* Bookings Table */}
      <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden">
        <h3 className="text-lg font-semibold p-4">Booking History</h3>
        
        <div className="hidden md:block">
          <BookingTableDesktop 
            bookings={bookings} 
            statusColors={statusColors}
            onDownload={handleDownloadInvoice}
          />
        </div>
        
        <div className="md:hidden">
          <BookingCardsMobile 
            bookings={bookings} 
            statusColors={statusColors}
            onDownload={handleDownloadInvoice}
          />
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <PaginationControls 
            pagination={pagination}
            onPageChange={fetchBookings}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components for better organization
const StatCard = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between sm:justify-center bg-white shadow-md p-4 rounded-xl">
    <div className="text-left">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
    {icon}
  </div>
);

const CurrentStayCard = ({ booking }) => (
  <div className="bg-white shadow-md p-4 rounded-xl mb-6">
    <h3 className="text-lg font-semibold mb-2">Current Accommodation</h3>
    <h2 className="text-xl font-bold">{booking.pgOwner?.messName}</h2>
    <div className="flex items-center text-sm text-gray-600 mt-1">
      <HiOutlineLocationMarker className="mr-1" />
      {booking.pgOwner?.address}
    </div>
    <div className="flex items-center text-sm text-gray-600 mt-1">
      <FaBed className="mr-1" />
      Room {booking.room} ({booking.bedsBooked} bed{booking.bedsBooked > 1 ? 's' : ''})
    </div>
    <div className="flex items-center text-sm text-gray-600 mt-1">
      <FaRupeeSign className="mr-1" />
      {booking.payment.totalAmount} (₹{booking.pricePerHead}/month)
    </div>
    <div className="mt-2 text-sm">
      <span className="font-medium">Stay Period: </span>
      {new Date(booking.period.startDate).toLocaleDateString()} - {' '}
      {new Date(booking.period.endDate).toLocaleDateString()}
    </div>
  </div>
);

const BookingTableDesktop = ({ bookings, statusColors, onDownload }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="text-left text-sm font-semibold text-gray-700">
          <th className="py-2 px-4">Booking ID</th>
          <th className="py-2 px-4">PG Name</th>
          <th className="py-2 px-4">Period</th>
          <th className="py-2 px-4">Amount</th>
          <th className="py-2 px-4">Status</th>
          <th className="py-2 px-4">Action</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
        {bookings.map((booking) => (
          <BookingTableRow 
            key={booking._id} 
            booking={booking} 
            statusColors={statusColors}
            onDownload={onDownload}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const BookingTableRow = ({ booking, statusColors, onDownload }) => (
  <tr className="border-t border-gray-100 hover:bg-gray-50">
    <td className="py-3 px-4">#{booking._id.slice(-6).toUpperCase()}</td>
    <td className="py-3 px-4">{booking.pgOwner?.messName}</td>
    <td className="py-3 px-4">
      {new Date(booking.period.startDate).toLocaleDateString()} - {' '}
      {new Date(booking.period.endDate).toLocaleDateString()}
    </td>
    <td className="py-3 px-4">₹{booking.payment.totalAmount}</td>
    <td className="py-3 px-4">
      <StatusBadge booking={booking} statusColors={statusColors} />
    </td>
    <td className="py-3 px-4">
      <BookingAction booking={booking} onDownload={onDownload} />
    </td>
  </tr>
);

const BookingCardsMobile = ({ bookings, statusColors, onDownload }) => (
  <div className="space-y-4 p-4">
    {bookings.map((booking) => (
      <div key={booking._id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500">
              Booking ID: #{booking._id.slice(-6).toUpperCase()}
            </p>
            <h4 className="text-md font-semibold">{booking.pgOwner?.messName}</h4>
          </div>
          <StatusBadge booking={booking} statusColors={statusColors} />
        </div>
        
        <BookingDetails booking={booking} />
        
        <BookingAction 
          booking={booking} 
          onDownload={onDownload} 
          mobile 
        />
      </div>
    ))}
  </div>
);

const StatusBadge = ({ booking, statusColors }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
    {booking.status}
    {booking.status === 'rejected' && booking.rejectionReason && (
      <span className="block text-xs mt-1">Reason: {booking.rejectionReason}</span>
    )}
  </span>
);

const BookingDetails = ({ booking }) => (
  <div className="mt-2 text-sm text-gray-700">
    <div className="flex items-center gap-2">
      <FaCalendarAlt className="text-gray-400" />
      {new Date(booking.period.startDate).toLocaleDateString()} - {' '}
      {new Date(booking.period.endDate).toLocaleDateString()}
    </div>
    <div className="mt-1 flex items-center">
      <FaRupeeSign className="mr-1" />
      {booking.payment.totalAmount}
    </div>
  </div>
);

const BookingAction = ({ booking, onDownload, mobile = false }) => (
  booking.status === 'confirmed' ? (
    <button 
      onClick={() => onDownload(booking._id)}
      className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
        mobile ? 'bg-blue-600 text-white' : 'text-blue-600 hover:text-blue-800'
      } text-sm font-medium`}
    >
      <FaDownload /> {mobile ? 'Download Invoice' : 'Invoice'}
    </button>
  ) : (
    <button className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
      mobile ? 'bg-gray-200 text-gray-800' : 'text-blue-600 hover:text-blue-800'
    } text-sm font-medium`}>
      <FaEye /> {mobile ? 'View Details' : 'Details'}
    </button>
  )
);

const PaginationControls = ({ pagination, onPageChange }) => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-600">
        Page {pagination.page} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= totalPages}
        className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default BookingTable;