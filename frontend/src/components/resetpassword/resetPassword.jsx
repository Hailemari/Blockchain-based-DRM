

// export default ResetPasswordPage
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../../services/authApi';
import ConfirmMailSent from '../popup/confirmMailSent';
import LoadingBar from 'react-top-loading-bar';
import { Triangle } from 'react-loader-spinner';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [triggerResetPassword, { isLoading, isError, error, isSuccess }] = useResetPasswordMutation();

  const handleResetPassword = (e) => {
    e.preventDefault();
    triggerResetPassword({ email, redirectUrl: 'http://localhost:5173/update-password' });
  };

  return (
    <header className="min-vh-100 d-flex flex-column color_light_white position-relative">
      <LoadingBar color="#FDA400" progress={isLoading ? 50 : 0} />
      <img
        className="position-absolute bottom-0 start-0 w-100"
        src="/Assets/Img/svg/bottom_wave.svg"
        alt="bottom_wave"
      />
      <nav className="border_bottom bg_color_white">
        <div className="container py-4 py_xsm_20">
          <div className="d-flex justify-content-between align-items-center">
            <Link to={'/login'}>
              <img className="nav_logo" src="/Assets/Img/svg/Explrar Logo.svg" alt="nav_logo" />
            </Link>
            <ul className="d-flex m-0 p-0">
              <li>
                <a className="fs_base fw_medium color_blue_black ff_inter" href="#">
                  Help
                </a>
              </li>
              <li className="ms-2">
                <a href="#">
                  <img
                    className="w_xsm_18"
                    src="/Assets/Img/svg/Question_icon.svg"
                    alt="Question_icon"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isError && error ? (
        <Stack className="fs_lg fw_xtr_bold ff_inter color_blue_black text-center">
          <Alert severity="error">{error.data?.message || 'An error occurred'}</Alert>
        </Stack>
      ) : null}

      <div className="d-flex justify-content-center align-items-center flex-grow-1 position-relative z-1 container">
        {isSuccess ? (
          <ConfirmMailSent
            msg={'Password Reset Instructions Sent'}
            p1={'Please check your inbox for an email with instructions on how to reset your password'}
            p2={"If you don't see the email, make sure to check your spam or junk folder."}
          />
        ) : (
          <div className="mini_container">
            <h1 className="fs_lg fw_xtr_bold ff_inter color_blue_black text-center">
              Reset Password
            </h1>
            <p className="fs_sm fw_normal ff_inter color_blue_black mt-3 pt-1 mb-0 text-center">
              Please enter your email. We will send you a link to reset&nbsp;your password.
            </p>
            <form className="mt-5" onSubmit={handleResetPassword}>
              <div
                style={isError ? { border: '1px solid #E71D36' } : {}}
                className="d-flex align-items-center input_border"
              >
                <img src="/Assets/Img/svg/Mail_icon.svg" alt="Mail_icon" />
                <input
                  className="fs_sm fw_normal ff_inter w-100 ps-2"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="login_btn w-100 fs_sm fw_bold ff_inter color_white mt-4"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Triangle
                    height="30"
                    width="30"
                    color="#FDA400"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{ justifyContent: 'space-around' }}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default ResetPasswordPage;
