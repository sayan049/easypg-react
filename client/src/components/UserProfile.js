import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const { userName, userImage, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (!userImage) { 
        const nameParts = userName.split(' ');
        const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
        const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() || '';

       
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

        
        setProfileData({
          backgroundColor: generateBackgroundColor(),
          initials: `${firstNameInitial}${lastNameInitial}`
        });
      } else {
        
        setProfileData({
          imageUrl: userImage
        });
      }
    } else {
      setProfileData(null); 
    }
  }, [userName, userImage, isAuthenticated]);

  if (!profileData) {
    return null;
  }

  return (
    <div className="user-profile" style={{ backgroundColor: profileData.backgroundColor }}>
      {profileData.imageUrl ? (
        <img src={profileData.imageUrl} alt="Profile" className="profile-image" />
      ) : (
        <div className="initials">{profileData.initials}</div>
      )}
    </div>
  );
};

export default UserProfile;
