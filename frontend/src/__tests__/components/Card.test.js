/* eslint-disable */

import { render, screen } from '@testing-library/react';
import { Card } from '../../components/Card';
import '@testing-library/jest-dom'

describe('Card', () => {
  const defaultProps = {
    title: 'Book Title',
    desc: 'This is a book description.',
    rate: 4.5,
  };

  it('renders the card with correct content', () => {
    render(<Card {...defaultProps} />);

    const titleElement = screen.getByText(defaultProps.title);
    const descElement = screen.getByText(defaultProps.desc);
    const rateElement = screen.getByText(defaultProps.rate.toString());

    expect(titleElement).toBeInTheDocument();
    expect(descElement).toBeInTheDocument();
    expect(rateElement).toBeInTheDocument();
  });

  it('renders the correct image', () => {
    render(<Card {...defaultProps} />);

    const imageElement = screen.getByAltText('Book Image');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    );
  });

 
  it('renders the correct tags', () => {
    render(<Card {...defaultProps} />);

    const fictionTag = screen.getByText('Fiction');
    const biographyTag = screen.getByText('Biography');
  });
});