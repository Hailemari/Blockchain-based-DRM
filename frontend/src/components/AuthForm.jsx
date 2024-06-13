import { useCallback, useEffect, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useSignupMutation } from '../services/authApi';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PropTypes from 'prop-types';
import Alert from './Alert';

const signinContent = {
  linkUrl: '/register',
  linkText: "Don't have an account?",
  header: 'Welcome Back',
  subheader: 'Enter your credentials to access your account',
  buttonText: 'Sign In',
  forgotPassword: 'Forgot Password?',
  redirect: 'Register',
};

const registerContent = {
  linkUrl: '/signin',
  linkText: 'Already have an account?',
  header: 'Create an account',
  subheader: 'Enter your details to create an account',
  buttonText: 'Register',
  redirect: 'Sign In',
};

const initialFormState = {
  userType: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const AuthForm = ({ mode }) => {
  const [formState, setFormState] = useState({ ...initialFormState });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const userTypeFromUrl = searchParams.get('role');
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      userType: userTypeFromUrl,
    }));
  }, [userTypeFromUrl]);

  const [login, { isError: isLoginError, error: loginError }] = useLoginMutation();
  const [signup, { isError: isSignupError, error: signupError }] = useSignupMutation();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({}); // Clear previous errors

      const validateInput = () => {
        let newErrors = {};

        if (mode === 'register' || mode === 'signin') {
          if (!formState.email.trim()) {
            newErrors.email = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = 'Invalid email format';
          }
        }

        if (mode === 'register') {
          if (!formState.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
          }
          if (!formState.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
          }
          if (!formState.password.trim()) {
            newErrors.password = 'Password is required';
          } else if (formState.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
          } else {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
            if (!passwordRegex.test(formState.password)) {
              newErrors.password = 'Password must contain at least one letter, one number, and one special character';
            }
          }

          if (formState.password !== formState.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
      };

      if (!validateInput()) {
        console.log('Validation failed');
        return;
      }

      try {
        if (mode === 'register') {
          await signup(formState).unwrap();
          setAlert({ message: 'Registration successful!', type: 'success' });
          setTimeout(() => {
            navigate('/signin');
          }, 500);
        } else {
          const result = await login(formState).unwrap();
          const { token, userType } = result;

          setAlert({ message: 'Login successful!', type: 'success' });

          localStorage.setItem('authToken', token);
          localStorage.setItem('userType', userType);

          let redirectPath = '/';
          if (userType === 'Creator') {
            redirectPath = '/creator_dashboard';
          } else if (userType === 'Consumer') {
            redirectPath = '/consumer_dashboard';
          } else if (userType === 'Admin') {
            redirectPath = '/admin-dashboard';
          }
          console.log('redirectPath', redirectPath);
          setTimeout(() => {
            navigate(redirectPath);
          }, 500);
        }
      } catch (e) {
        if (mode === 'register' && signupError?.data?.message === 'User already exists') {
          setAlert({ message: 'User already exists. Please try logging in.', type: 'error' });
        } else if (mode === 'signin' && loginError?.data?.message === 'Invalid email or password') {
          setAlert({ message: 'Invalid email or password. Please try again.', type: 'error' });
        } else {
          setAlert({ message: `Could not ${mode}. Please try again later.`, type: 'error' });
        }
      }
    },
    [formState, mode, login, signup, navigate, signupError, loginError]
  );

  const handlePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const content = mode === 'register' ? registerContent : signinContent;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {content.header}
      </h2>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <p className="text-gray-600 mb-6 text-center">{content.subheader}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">First Name</label>
                <input
                  type="text"
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formState.firstName}
                  placeholder="Enter First Name"
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      firstName: e.target.value,
                    }))
                  }
                />
                {errors.firstName && (
                  <p className="text-red-500 mt-2">{errors.firstName}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Last Name</label>
                <input
                  type="text"
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formState.lastName}
                  placeholder="Enter Last Name"
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      lastName: e.target.value,
                    }))
                  }
                />
                {errors.lastName && (
                  <p className="text-red-500 mt-2">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formState.email}
                placeholder="Enter Email"
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              {errors.email && (
                <p className="text-red-500 mt-2">{errors.email}</p>
              )}
            </div>
          </>
        )}

        {mode === 'signin' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="text"
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState.email}
              placeholder="Enter Email"
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
            {errors.email && (
              <p className="text-red-500 mt-2">{errors.email}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState.password}
              placeholder="Enter Password"
              autoComplete="off"
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={handlePasswordVisibility}
            >
              {showPassword ? (
                <AiFillEye className="text-gray-500" />
              ) : (
                <AiFillEyeInvisible className="text-gray-500" />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 mt-2">{errors.password}</p>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formState.confirmPassword}
                  placeholder="Confirm Password"
                  autoComplete="off"
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={handleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <AiFillEye className="text-gray-500" />
                  ) : (
                    <AiFillEyeInvisible className="text-gray-500" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 mt-2">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                required
              />
              <p className="text-gray-600 ml-2">
                I agree to the terms and conditions
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition w-full font-semibold"
        >
          {content.buttonText}
        </button>
      </form>
      {errors.general && (
        <p className="text-red-500 mt-2 text-center">{errors.general}</p>
      )}
      {mode === 'signin' && (
        <div className="flex justify-end mt-4">
          <Link
            to="/request-password-reset"
            className="text-gray-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      )}
      <div className="flex items-center mt-8">
        <div className="border-t border-gray-300 w-full flex-grow"></div>
        <span className="px-3 text-gray-500">Or</span>
        <div className="border-t border-gray-300 w-full flex-grow"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          className="flex border items-center border-gray-300 rounded py-2 px-4 hover:bg-gray-100 transition"
          onClick={() => {}}
        >
          <FcGoogle className="mr-2" />
          Google
        </button>
        <button
          className="flex items-center border border-gray-300 rounded py-2 px-4 hover:bg-gray-100 transition"
          onClick={() => {}}
        >
          <FaFacebook className="mr-2" />
          Facebook
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          {content.linkText}{' '}
          <Link to={content.linkUrl} className="text-blue-500 hover:underline">
            {content.redirect}
          </Link>
        </p>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.oneOf(['register', 'signin']).isRequired,
};

export default AuthForm;
