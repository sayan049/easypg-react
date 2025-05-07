// import React, { useEffect, useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
// import { mailVerifyUrl } from "../constant/urls";

// const MailVerify = () => {
//     const location = useLocation();
//     const navigate = useNavigate(); // Use useNavigate hook
//     const query = new URLSearchParams(location.search);
//     const id = query.get('id');
//     const [message, setMessage] = useState('Verifying your email...');
//     const [verified, setVerified] = useState(null);
//     const requestSent = useRef(false);  // Ref to track if the request is sent

//     useEffect(() => {
//         if (id && !requestSent.current) {
//             requestSent.current = true;  // Mark the request as sent
//             // console.log(id)
//             fetch(`${mailVerifyUrl}?id=${id}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.verified === 'true') {
//                         setMessage('Your email has been verified successfully!');
//                         setVerified(true);
//                     } else if (data.verified === 'false') {
//                         setMessage('Verification failed or already verified.');
//                         setVerified(false);
//                     } else {
//                         setMessage('An error occurred during verification.');
//                         setVerified(null);
//                     }
//                 })
//                 .catch(() => {
//                     setMessage('An error occurred during verification.');
//                     setVerified(null);
//                 });
//         } else if (!id) {
//             setMessage('No verification id provided.');
//             setVerified(null);
//         }
//     }, [id]);

    
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
//             <h1>{message}</h1>
              
//             {verified === true && (
//                 <button style={{ height: "20px", width: "auto" }} onClick={() => navigate('/LoginUser')}> {/* Use navigate instead */}
//                     Go to Login
//                 </button>
//             )}
//         </div>
//     );
// };

// export default MailVerify;
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mailVerifyUrl } from "../constant/urls";

const MailVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    const email = query.get('email'); // Assuming you can pass email as query parameter
    const [message, setMessage] = useState('Verifying your email...');
    const [verified, setVerified] = useState(null);
    const requestSent = useRef(false);

    useEffect(() => {
        if (id && !requestSent.current) {
            requestSent.current = true;
            fetch(`${mailVerifyUrl}?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.verified === 'true') {
                        setMessage('Your email has been verified successfully!');
                        setVerified(true);
                        
                        // Notify the original login tab
                        localStorage.setItem('verificationCompleted', 'true');
                        if (email) {
                            localStorage.setItem('verificationEmail', email);
                        }
                        
                        // Try to communicate with opener window if it exists
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'verificationCompleted',
                                email: email
                            }, '*');
                        }
                    } else if (data.verified === 'false') {
                        setMessage('Verification failed or already verified.');
                        setVerified(false);
                    } else {
                        setMessage('An error occurred during verification.');
                        setVerified(null);
                    }
                })
                .catch(() => {
                    setMessage('An error occurred during verification.');
                    setVerified(null);
                });
        } else if (!id) {
            setMessage('No verification id provided.');
            setVerified(null);
        } 
    }, [id, email]);

    // Close the window automatically after successful verification
    useEffect(() => {
        if (verified === true) {
            const timer = setTimeout(() => {
                window.close();
            }, 3000); // Close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [verified]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '20px' }}>{message}</h1>
              
            {verified === true && (
                <button 
                    style={{ 
                        padding: '10px 20px',
                        backgroundColor: '#2ca4b5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }} 
                    onClick={() => navigate('/login/user')} // Use navigate instead
                >
                    Go to Login
                </button>
            )}
        </div>
    );
};

export default MailVerify;