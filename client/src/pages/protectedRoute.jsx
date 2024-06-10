// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as jwt_decode from 'jwt-decode'; // Import jwt_decode for decoding tokens
// import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie

// function ProtectedRoute() {
//     const navigate = useNavigate();
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [cookies] = useCookies(['token']); // Use useCookies hook to access cookies

//     useEffect(() => {
//         const token = cookies.token; // Access token from cookies
//         if (token) {
//             try {
//                 const decoded = jwt_decode(token);
//                 console.log('User ID:', decoded.id);
//                 console.log('User Email:', decoded.email);
//                 setIsAuthenticated(true);
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//                 // navigate('/login');
//             }
//         } else {
//             console.error('Token is not present in cookies');
//             // navigate('/login');
//         }
//     }, [navigate, cookies.token]); // Add cookies.token to dependency array

//     return (
//         <div>
//             {isAuthenticated ? (
//                 <>
//                     <h1>Protected Route</h1>
//                     <p>This is a protected route. Only authenticated users can see this.</p>
//                 </>
//             ) : null}
//         </div>
//     );
// }

// export default ProtectedRoute;
