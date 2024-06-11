/* eslint-disable */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from '../../components/newUserCard';

describe('UserCard', () => {
  const mockIcon = <span>🙂</span>;
  const mockUserType = 'user';
  const mockDescription = 'This is a user card.';
  const mockSetUserType = jest.fn();

  test('renders the icon correctly', () => {
    render(
      <UserCard
        icon={mockIcon}
        userType={mockUserType}
        selectedUserType={mockUserType}
        setUserType={mockSetUserType}
        description={mockDescription}
      />
    );

    const iconElement = screen.getByText('🙂');
    expect(iconElement).toBeInTheDocument();
  });

  test('renders the description correctly', () => {
    render(
      <UserCard
        icon={mockIcon}
        userType={mockUserType}
        selectedUserType={mockUserType}
        setUserType={mockSetUserType}
        description={mockDescription}
      />
    );

    const descriptionElement = screen.getByText(mockDescription);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders the radio button with the correct checked state', () => {
    render(
      <UserCard
        icon={mockIcon}
        userType={mockUserType}
        selectedUserType={mockUserType}
        setUserType={mockSetUserType}
        description={mockDescription}
      />
    );

    const radioButton = screen.getByRole('radio', { checked: true });
    expect(radioButton).toBeInTheDocument();
  });

  test('calls setUserType when the card is clicked and userType is not selected', () => {
    render(
      <UserCard
        icon={mockIcon}
        userType={mockUserType}
        selectedUserType={'other'}
        setUserType={mockSetUserType}
        description={mockDescription}
      />
    );

    const cardElement = screen.getByRole('radio');
    fireEvent.click(cardElement);
    expect(mockSetUserType).toHaveBeenCalledWith(mockUserType);
  });
});