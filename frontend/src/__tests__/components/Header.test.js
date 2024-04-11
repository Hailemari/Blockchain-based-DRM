/* eslint-disable */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '../../components/Header';

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const logoElement = screen.getByText(/DRM/i);
    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('About');
    const contactLink = screen.getByText('Contact');

    expect(logoElement).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it('opens and closes the profile dropdown', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: /profile/i });
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.getByText('Account settings')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Account settings'));
    expect(screen.queryByText('Account settings')).not.toBeInTheDocument();
  });

  it('renders the sign out button', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const profileButton = screen.getByRole('button', { name: /profile/i });
    fireEvent.click(profileButton);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});