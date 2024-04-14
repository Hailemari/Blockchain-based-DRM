import AuthForm from "../../src/components/AuthForm";
import { Register } from "../../src/pages/Register";
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("../../src/components/AuthForm", () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="mocked-auth-form" />),
}));

describe('Register', () => {
    it('renders the AuthForm component in register mode', () => {
        render(<Register />);
        
        // Assert that the mocked AuthForm component is called with the correct mode
        expect(AuthForm).toHaveBeenCalledWith({ mode: 'register' });

        // If you want to test specific elements rendered by AuthForm (assuming AuthForm handles rendering form fields):
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
    });
});
