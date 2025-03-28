import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const { userName, userImage, IsAuthenticated, isOwnerAuthenticated, ownerImage, ownerName } = useAuth();

  useEffect(() => {
    if (IsAuthenticated) {
      if (!userImage) {
        // For student profile without an image
        console.log(userName);
        if (userName) {
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
        }
      } else {
        // For student profile with an image
        setProfileData({
          imageUrl: userImage
        });
      }
    } else if (isOwnerAuthenticated) {
      // For owner profile
      if (!ownerImage) {
        console.log(ownerName);
        if (ownerName) {
          // If owner profile doesn't have an image
          const nameParts = ownerName.split(' ');
          const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() || '';
          const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() || '';

          const generateBackgroundColor = () => {
            let hash = 0;
            for (let i = 0; i < ownerName.length; i++) {
              hash = ownerName.charCodeAt(i) + ((hash << 5) - hash);
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
        }
      } else {
        // If owner profile has an image
        setProfileData({
          imageUrl: ownerImage
        });
      }
    } else {
      // Reset profile data if neither authenticated nor owner authenticated
      setProfileData(null);
    }
  }, [userName, userImage, IsAuthenticated, isOwnerAuthenticated, ownerName, ownerImage]);

  if (!profileData) {
    return null;
  }

  return (
    <div className="user-profile" style={{ backgroundColor: profileData.backgroundColor }}>
      {profileData.imageUrl? (
        <img src={profileData.imageUrl} alt="Profile" className="profile-image h-[2.3rem]" />
      ) : (
        <div className="initials">{profileData.initials}</div>
      )}
    </div>
  );
};

export default UserProfile;
