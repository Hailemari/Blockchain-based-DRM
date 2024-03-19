import axios from 'axios'
import { useCallback, useState } from 'react'
import { FaFacebook } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'

const signinContent = {
  linkUrl: '/register',
  linkText: "Don't have an account?",
  header: 'Welcome Back',
  subheader: 'Enter your credentials to access your account',
  buttonText: 'Sign In',
  forgotPassword: 'Forgot Password?',
  redirect: 'Register',
  reset: 'Reset Password',
}

const registerContent = {
  linkUrl: '/signin',
  linkText: 'Already have an account?',
  header: 'Create an account',
  subheader: 'Enter your details to create an account',
  buttonText: 'Register',
  redirect: 'Sign In',
}

const initialFormState = {
  userType: 'creator',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const AuthForm = ({ mode }: { mode: 'register' | 'signin' }) => {
  const [formState, setFormState] = useState({ ...initialFormState })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const api = 'http://localhost:5000/auth'

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault()

      try {
        if (mode === 'register') {
          const response = await axios.post(`${api}/signup`, formState)
          // Handle successful registration
          console.log(response.data)
          navigate('/profile')
        } else {
          const response = await axios.post(`${api}/login`, formState)
          // Handle successful sign in
          console.log(response.data)
          navigate('/profile')
        }
      } catch (e) {
        setError(`Could not ${mode}`)
      } finally {
        setFormState({ ...initialFormState })
      }
    },
    [formState, mode],
  )

  const content = mode === 'register' ? registerContent : signinContent

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {content.header}
      </h2>
      <p className="text-gray-600 mb-4 text-center">{content.subheader}</p>
      <h1>Continue With</h1>
      <div className="grid grid-cols-2 gap-8">
        <button className="flex items-center   rounded " onClick={() => {}}>
          <FcGoogle className="mr-2" />
          Google
        </button>

        <button className="flex items-center  rounded " onClick={() => {}}>
          <FaFacebook className="mr-2" />
          Facebook
        </button>
      </div>

      <div className="flex items-center mt-4">
        <div className="border-t border-gray-300 w-full"></div>
        <span className="px-3 text-gray-500">Or</span>
        <div className="border-t border-gray-300 w-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">First Name:</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded"
                  value={formState.firstName}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Last Name:</label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded"
                  value={formState.lastName}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                className="mt-1 p-2 w-full border rounded"
                value={formState.email}
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">username</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={formState.username}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                username: e.target.value,
              }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Password:
            {/* <FaEye className="ml-2 cursor-pointer text-gray-500" /> */}
          </label>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded"
            value={formState.password}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                password: e.target.value,
              }))
            }
          />
        </div>

        {mode === 'register' && (
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              className="mt-1 p-2 w-full border rounded"
              value={formState.confirmPassword}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  confirmPassword: e.target.value,
                }))
              }
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-500"
              />
              <p className="text-gray-600 ml-2">
                I agree to the terms and conditions
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
        >
          {content.buttonText}
        </button>
      </form>

      <p className="text-red-500 mt-2">{error && <span>{error}</span>}</p>

      {/* Reset Password button */}

      {mode === 'signin' && (
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
          >
            Reset Password
          </button>
        </div>
      )}

      <p className="mt-4 text-gray-700 text-center">
        {content.linkText}{' '}
        <Link to={content.linkUrl} className="text-blue-500 hover:underline">
          {content.redirect}
        </Link>
      </p>
    </div>
  )
}

export default AuthForm
