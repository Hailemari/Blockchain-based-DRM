/* eslint-disable */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Greetings from '../../components/greeting';

describe('Greetings', () => {
  it('renders "Good Morning" before 12 PM', () => {
    // Mock the current time to be 9 AM
    jest.useFakeTimers().setSystemTime(new Date(2023, 4, 10, 9, 0, 0));

    render(<Greetings />);

    const greetingElement = screen.getByText('Good Morning');
    expect(greetingElement).toBeInTheDocument();
  });

  it('renders "Good Afternoon" between 12 PM and 6 PM', () => {
    // Mock the current time to be 3 PM
    jest.useFakeTimers().setSystemTime(new Date(2023, 4, 10, 15, 0, 0));

    render(<Greetings />);

    const greetingElement = screen.getByText('Good Afternoon');
    expect(greetingElement).toBeInTheDocument();
  });

  it('renders "Good Evening" after 6 PM', () => {
    // Mock the current time to be 8 PM
    jest.useFakeTimers().setSystemTime(new Date(2023, 4, 10, 20, 0, 0));

    render(<Greetings />);

    const greetingElement = screen.getByText('Good Evening');
    expect(greetingElement).toBeInTheDocument();
  });
});