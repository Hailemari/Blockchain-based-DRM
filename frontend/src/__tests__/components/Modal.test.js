/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../components/Modal';

describe('Modal component', () => {
  const contentTypes = ['Type 1', 'Type 2', 'Type 3'];
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal with the correct title', () => {
    render(<Modal onClose={onCloseMock} contentTypes={contentTypes} />);
    const modalTitle = screen.getByText('Choose Content Type');
    expect(modalTitle).toBeInTheDocument();
  });

  test('renders the correct number of content type buttons', () => {
    render(<Modal onClose={onCloseMock} contentTypes={contentTypes} />);
    const contentTypeButtons = screen.getAllByRole('button', { name: /Type/ });
    expect(contentTypeButtons).toHaveLength(contentTypes.length);
  });

  test('renders the cancel button', () => {
    render(<Modal onClose={onCloseMock} contentTypes={contentTypes} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
  });

  test('calls the onClose function when the cancel button is clicked', () => {
    render(<Modal onClose={onCloseMock} contentTypes={contentTypes} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
});