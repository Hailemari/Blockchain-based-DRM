/* eslint-disable */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from '../../components/Alert';


describe('Alert', () => {
  it('should render an alert with the correct message', () => {
    const message = 'This is a success message';
    render(<Alert message={message} type="success" />);

    const alertElement = screen.getByText(message);
    expect(alertElement).toBeInTheDocument();
  });

  it('should render an alert with the correct class for success type', () => {
    render(<Alert message="Success message" type="success" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-success');
  });

  it('should render an alert with the correct class for error type', () => {
    render(<Alert message="Error message" type="error" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-error');
  });

  it('should render an alert with the correct class for info type', () => {
    render(<Alert message="Info message" type="info" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-info');
  });

  it('should render an alert with the correct class for an unknown type', () => {
    render(<Alert message="Unknown message" type="unknown" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert-info');
  });
});