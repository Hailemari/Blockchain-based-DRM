import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useSignupMutation } from '../services/authApi';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PropTypes from 'prop-types';
import Alert from './Alert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

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
  const [loading, setLoading] = useState(false);
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

          if (!formState.userType) {
            newErrors.userType = 'User type is required';
          }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
      };

      if (!validateInput()) {
        console.log('Validation failed');
        return;
      }

      setLoading(true);

      try {
        if (mode === 'register') {
          const result = await signup(formState).unwrap();
          setAlert({ message: 'Registration successful!', type: 'success' });

          const { token, userType } = result;

          localStorage.setItem('authToken', token);
          localStorage.setItem('userType', userType);

          toast.success('Successfully registered!');
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
          }, 5);
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
          
          navigate(redirectPath);
         
        }
      } catch (e) {
        setLoading(false);
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

  useEffect(() => {
    if (isLoginError && loginError) {
      setLoading(false);
      if (loginError?.data?.message === 'Invalid email or password') {
        setAlert({ message: 'Invalid email or password. Please try again.', type: 'error' });
      } else {
        setAlert({ message: 'Could not sign in. Please try again.', type: 'error' });
      }
    } else if (isSignupError && signupError) {
      setLoading(false);
      if (signupError?.data?.message === 'User already exists') {
        setAlert({ message: 'User already exists. Please try logging in.', type: 'error' });
      } else {
        setAlert({ message: 'Could not register. Please try again.', type: 'error' });
      }
    }
  }, [isLoginError, loginError, isSignupError, signupError]);

  const handlePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const content = mode === 'register' ? registerContent : signinContent;

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-md relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-10">
          <ClipLoader size={60} color={"#10B981"} loading={loading} />
          <p className="mt-4 text-green-600">Please wait...</p>
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {content.header}
      </h2>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <p className="text-gray-600 mb-6 text-center">{content.subheader}</p>
      <form onSubmit={handleSubmit} className={`space-y-6 ${loading ? 'pointer-events-none' : ''}`}>
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">First Name</label>
                <input
                  type="text"
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                required
              />
              <p className="text-gray-600 ml-2">
                I agree to the terms and conditions
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Consumer"
                    checked={formState.userType === 'Consumer'}
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        userType: e.target.value,
                      }))
                    }
                    className="form-radio h-4 w-4 text-green-500"
                  />
                  <span className="ml-2 text-gray-700">Consumer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Creator"
                    checked={formState.userType === 'Creator'}
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        userType: e.target.value,
                      }))
                    }
                    className="form-radio h-4 w-4 text-green-500"
                  />
                  <span className="ml-2 text-gray-700">Creator</span>
                </label>
              </div>
              {errors.userType && (
                <p className="text-red-500 mt-2">{errors.userType}</p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition w-full font-semibold flex items-center justify-center"
          disabled={loading}
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
            to="/forgot-password"
            className="text-gray-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      )}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          {content.linkText}{' '}
          <Link to={content.linkUrl} className="text-green-500 hover:underline">
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
