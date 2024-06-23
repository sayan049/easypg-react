import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const {userName} = useAuth();
  const {isAuthenticated} = useAuth();

 

  useEffect(() => {
   
    if (isAuthenticated) {
      try {
        // Decode token
       
        
        // console.log('User ID:', userId);
        // console.log('User Email:', userEmail);
        console.log('user name:', userName);
        
        // Generate initials based on the user's name
        const nameParts = userName.split(' ');
        const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
        const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() || '';

        // Generate a random background color
        const generateBackgroundColor = () => {
          let hash = 0;
          for (let i = 0; i < userName.length; i++) {
            hash = userName.charCodeAt(i) + ((hash << 5) - hash);
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
  }, [userName,isAuthenticated]);

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
