import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  useEffect(() => {
    const token = getCookie('user_token'); // Access token from cookies
    console.log('Token from cookies:', token); // Debugging log
    if (token) {
      try {
        // Decode token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        const userId = decodedToken.id;
        const userEmail = decodedToken.email;
        const Username = decodedToken.name; // Make sure your token includes a 'name' field
        
        console.log('User ID:', userId);
        console.log('User Email:', userEmail);
        console.log('user name:', Username);
        
        // Generate initials based on the user's name
        const nameParts = Username.split(' ');
        const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
        const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() || '';

        // Generate a random background color
        const generateBackgroundColor = () => {
          let hash = 0;
          for (let i = 0; i < Username.length; i++) {
            hash = Username.charCodeAt(i) + ((hash << 5) - hash);
          }
          let color = '#';
          for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
          }
          return color;
        };

        // Set the profile data state
        setProfileData({
          backgroundColor: generateBackgroundColor(),
          initials: `${firstNameInitial}${lastNameInitial}`
        });
      } catch (error) {
        console.error('Error decoding or accessing token:', error);
      }
    } else {
      console.error('Token is not present in cookies');
    }
  }, []);

  if (!profileData) {
    return null; 
  }

  return (
    <div className="user-profile" style={{ backgroundColor: profileData.backgroundColor }}>
      <span className="initials">{profileData.initials}</span>
    </div>
  );
};

export default UserProfile;
