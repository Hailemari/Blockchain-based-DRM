/* eslint-disable */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../services/authSlice';
import { Provider } from 'react-redux';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'test-token' }));
  }),
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(ctx.json({ message: 'Registration successful' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (ui, { preloadedState = {}, store = configureStore({ reducer: { auth: authReducer }, preloadedState }), ...renderOptions } = {}) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('AuthForm', () => {
  it('renders the login form correctly', () => {
    renderWithProviders(
      <Router>
        <AuthForm mode="signin" />
      </Router>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders the registration form correctly', () => {
    renderWithProviders(
      <Router>
        <AuthForm mode="register" />
      </Router>
    );

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('displays an error message for invalid input', async () => {
    renderWithProviders(
      <Router>
        <AuthForm mode="register" />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter First Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Last Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'pass' } });

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      expect(screen.getByText('Password must contain at least one letter, one number, and one special character')).toBeInTheDocument();
    });
  });

  it('displays a success message after successful registration', async () => {
    renderWithProviders(
      <Router>
        <AuthForm mode="register" />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });
  });

  it('displays a success message after successful login', async () => {
    renderWithProviders(
      <Router>
        <AuthForm mode="signin" />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Username or Email'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });
  });
});