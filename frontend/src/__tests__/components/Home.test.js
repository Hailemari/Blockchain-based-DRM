/* eslint-disable */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../components/Home';

describe('Home component', () => {
  test('renders the header', () => {
    render(<Home />);
    const headerElement = screen.getByText(/Explore Books/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the categories dropdown', () => {
    render(<Home />);
    const categoriesDropdown = screen.getByRole('combobox');
    expect(categoriesDropdown).toBeInTheDocument();
  });

  test('renders the search input', () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders the "Add Book" button', () => {
    render(<Home />);
    const addBookButton = screen.getByRole('button', { name: /Add Book/i });
    expect(addBookButton).toBeInTheDocument();
  });
});