import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { mailVerifyUrl } from "../constant/urls";

const MailVerify = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    const [message, setMessage] = useState('Verifying your email...');
    const [verified, setVerified] = useState(null);
    const requestSent = useRef(false);  // Ref to track if the request is sent

    useEffect(() => {
        if (id && !requestSent.current) {
            requestSent.current = true;  // Mark the request as sent
            console.log(id + "xxx")
            fetch(`${mailVerifyUrl}?id=${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.verified === 'true') {
                        setMessage('Your email has been verified successfully!');
                        setVerified(true);
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
    }, [id]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h1>{message}</h1>
            {verified === true && <button onClick={() => window.location.href = '/login'}>Go to Login</button>}
        </div>
    );
};

export default MailVerify;
