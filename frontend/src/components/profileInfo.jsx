import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import dayjs from 'dayjs';
import Skeleton from '@mui/material/Skeleton';

import { useGetProfileQuery, useUpdateProfileMutation, useSaveProfilePicMutation } from '../services/authApi';

export default function Profile() {
  const { data: userProfile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [saveProfilePic, { isLoading: isSavingPic }] = useSaveProfilePicMutation();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dob: null,
    phone: ''
  });

  const [alert, setAlert] = useState({ msg: '', type: '' });
  const [error, setError] = useState({ errorType: '', errorMessage: '' });


  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile?.data?.user?.firstName || '',
        lastName: userProfile?.data?.user?.lastName || '',
        dob: dayjs(userProfile?.data?.user?.dob).format('DD/MM/YYYY') || null,
        phone: userProfile?.data?.user?.phone || ''
      });
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { ...profileData };
      if (updatedData.dob && !dayjs(updatedData.dob, 'DD/MM/YYYY', true).isValid()) {
        setAlert({ msg: 'Invalid date format', type: 'error' });
        return;
      }
      if (updatedData.dob) {
        updatedData.dob = dayjs(updatedData.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
      }
      await updateProfile(updatedData).unwrap();
      setAlert({ msg: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      setAlert({ msg: 'Failed to update profile', type: 'error' });
    }
  };

  const handleCancelUpdate = () => {
    setProfileData({
      firstName: userProfile?.data?.user?.firstName || '',
      lastName: userProfile?.data?.user?.lastName || '',
      dob: dayjs(userProfile?.data?.user?.dob).format('DD/MM/YYYY') || null,
      phone: userProfile?.data?.user?.phone || ''
    });
  };

  const fileInputRef = useRef(null);
  const [imageChange, setImageChange] = useState({
    status: false,
    opacity: 1,
    img: null
  });

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
        setAlert({ msg: 'Please select PNG or JPG format', type: 'error' });
        return;
      }
      if (file.size <= 2 * 1024 * 1024) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const profileUrl = await saveProfilePic(formData).unwrap();
          if (imageChange.img) URL.revokeObjectURL(imageChange.img);
          setImageChange({ ...imageChange, img: URL.createObjectURL(file) });
          await updateProfile({ profile_pic: profileUrl });
          setAlert({ msg: 'Profile picture updated. Please refresh page!', type: 'success' });
        } catch (error) {
          setAlert({ msg: 'Failed to upload profile pic', type: 'error' });
        }
      } else {
        setAlert({ msg: 'Please select a file less than 2MB.', type: 'error' });
      }
    } else {
      setAlert({ msg: 'Please select a file.', type: 'error' });
    }
  };

  if (isLoading || isUpdating || isSavingPic) return <Skeleton variant="rectangular" width="100%" height="100%" />;

  return (
    <div className="profile">
      <Alert msg={alert.msg} type={alert.type} />
      <h5 className="fs-22 fw-600 color-blue-black mb-0">My Profile</h5>
      <div className="user-profile d-flex align-items-center">
        <img
          className="profile-pic"
          src={
            imageChange.img ||
            (userProfile?.data?.user?.profile_pic
              ? userProfile.data.user.profile_pic
              : '../../../Assets/icons/user-profile-icon.svg')
          }
          alt="user-profile"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          style={{ display: 'none' }}
        />
        <button
          className="edit-btn"
          onClick={() => fileInputRef.current.click()}
        >
          Change Profile Picture
        </button>
      </div>
      <div className="persnal-info">
        <div className="d-flex align-items-center justify-content-between">
          <p className="fs-22 fw-500 color-blue-black">Personal Information</p>
          {profileData.status ? (
            <div>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleCancelUpdate}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleUpdateProfile}
              >
                Save
              </button>
            </div>
          ) : (
            <div
              className="d-flex align-items-center"
              onClick={() => setProfileData({ ...profileData, status: true })}
              style={{ cursor: 'pointer' }}
            >
              <p className="fs-16 fw-400 color-blue-black">Edit</p>
              <img className="ps-2" src="/Assets/icons/edit-icon.svg" alt="edit-icon" />
            </div>
          )}
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
          <div className="d-flex flex-column flex-grow-1">
            <label htmlFor="firstName" className="fs-16 fw-400 color-blue-black">
              First Name
            </label>
            {profileData.status ? (
              <input
                type="text"
                id="firstName"
                className="fs-16 fw-400 color-blue-black"
                value={profileData.firstName}
                onChange={(e) =>
                  setProfileData({ ...profileData, firstName: e.target.value })
                }
              />
            ) : (
              <p className="fs-16 fw-400 color-blue-black">
                {profileData.firstName}
              </p>
            )}
          </div>
          <div className="d-flex flex-column flex-grow-1 ms-md-5 mt-3 mt-md-0">
            <label htmlFor="lastName" className="fs-16 fw-400 color-blue-black">
              Last Name
            </label>
            {profileData.status ? (
              <input
                type="text"
                id="lastName"
                className="fs-16 fw-400 color-blue-black"
                value={profileData.lastName}
                onChange={(e) =>
                  setProfileData({ ...profileData, lastName: e.target.value })
                }
              />
            ) : (
              <p className="fs-16 fw-400 color-blue-black">
                {profileData.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
          <div className="d-flex flex-column flex-grow-1">
            <label htmlFor="dob" className="fs-16 fw-400 color-blue-black">
              Date of Birth
            </label>
            {/* {profileData.status ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={profileData.dob}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => {
                    setProfileData({ ...profileData, dob: newValue })
                  }}
                  renderInput={(params) => <input {...params} />}
                />
              </LocalizationProvider>
            ) : (
              <p className="fs-16 fw-400 color-blue-black">
                {dayjs(profileData.dob).format('MMM DD, YYYY')}
              </p>
            )} */}
          </div>
          <div className="d-flex flex-column flex-grow-1 ms-md-5 mt-3 mt-md-0">
            <label htmlFor="phone" className="fs-16 fw-400 color-blue-black">
              Phone Number
            </label>
            {profileData.status ? (
              <PhoneInput
                country={'us'}
                value={profileData.phone}
                onChange={(phone) => {
                  setProfileData({ ...profileData, phone });
                }}
                onBlur={(e) => {
                  if (e.target.value.length < 10 || e.target.value.length > 15) {
                    setError({
                      errorType: 'phoneNumber',
                      errorMessage: 'Phone number must be between 10 and 15 digits',
                    });
                  } else {
                    setError({ errorType: '', errorMessage: '' });
                  }
                }}
              />
            ) : (
              <p className="fs-16 fw-400 color-blue-black">
                {profileData.email}
              </p>
            )}
          </div>
        </div>
        {error.errorType === 'phoneNumber' && (
          <p className="text-danger fs-14 fw-400 mt-2">{error.errorMessage}</p>
        )}
      </div>
    </div>
  );
}
