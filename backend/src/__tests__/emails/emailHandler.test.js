import { sendWelcomeEmail } from '../../emails/emailHandler.js';

// Mock the resend client and email template
const mockResendClient = {
  emails: {
    send: null // Will be set in each test
  }
};

const mockSender = {
  name: 'Test Sender',
  email: 'test@example.com'
};

// Mock the modules
jest.unstable_mockModule('../../lib/resend.js', () => ({
  resendClient: mockResendClient,
  sender: mockSender
}));

jest.unstable_mockModule('../../emails/emailTemplates.js', () => ({
  createVerificationEmailTemplate: jest.fn((name, url) => `<html>Welcome ${name}! Verify: ${url}</html>`)
}));

describe('sendWelcomeEmail', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Happy Path - Successful Email Sending', () => {
    test('should send email successfully with valid parameters', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await expect(
        sendWelcomeEmail('test@example.com', 'John Doe', 'https://example.com/verify?token=abc')
      ).resolves.not.toThrow();

      expect(mockResendClient.emails.send).toHaveBeenCalledTimes(1);
    });

    test('should call resend with correct email structure', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'Jane Smith', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: `${mockSender.name} <${mockSender.email}>`,
          to: 'user@example.com',
          subject: 'Verify To Get Started'
        })
      );
    });

    test('should include HTML content in email', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'Test User', 'https://example.com/verify');

      const callArgs = mockResendClient.emails.send.mock.calls[0][0];
      expect(callArgs.html).toBeTruthy();
      expect(typeof callArgs.html).toBe('string');
    });

    test('should log email address before sending', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      const email = 'logtest@example.com';
      await sendWelcomeEmail(email, 'User', 'https://example.com/verify');

      expect(consoleLogSpy).toHaveBeenCalledWith(email);
    });

    test('should log success message after sending', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'User', 'https://example.com/verify');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifcation Email Sent Successfully');
    });
  });

  describe('Edge Cases - Different Email Formats', () => {
    test('should handle email with subdomain', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@subdomain.example.com', 'User', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@subdomain.example.com'
        })
      );
    });

    test('should handle email with plus sign', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user+test@example.com', 'User', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user+test@example.com'
        })
      );
    });

    test('should handle email with dots', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('first.last@example.com', 'User', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'first.last@example.com'
        })
      );
    });
  });

  describe('Edge Cases - Different Name Formats', () => {
    test('should handle name with spaces', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'John Middle Doe', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });

    test('should handle single word name', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'Madonna', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });

    test('should handle name with special characters', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', "O'Brien-Smith", 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });
  });

  describe('Edge Cases - Different URL Formats', () => {
    test('should handle URL with query parameters', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail(
        'user@example.com',
        'User',
        'https://example.com/verify?token=abc&redirect=/dashboard'
      );

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });

    test('should handle localhost URL', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'User', 'http://localhost:3000/verify?token=abc');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });
  });

  describe('Failure Conditions - Resend API Errors', () => {
    test('should throw error when resend returns error', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'API error' }
      });

      await expect(
        sendWelcomeEmail('user@example.com', 'User', 'https://example.com/verify')
      ).rejects.toThrow('Failed to send verification email');
    });

    test('should log error message when resend fails', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'API error' }
      });

      try {
        await sendWelcomeEmail('user@example.com', 'User', 'https://example.com/verify');
      } catch (e) {
        // Expected to throw
      }

      expect(consoleLogSpy).toHaveBeenCalledWith('Error Sending Verification Email');
    });

    test('should handle network errors', async () => {
      mockResendClient.emails.send = jest.fn().mockRejectedValue(
        new Error('Network error')
      );

      await expect(
        sendWelcomeEmail('user@example.com', 'User', 'https://example.com/verify')
      ).rejects.toThrow();
    });

    test('should handle timeout errors', async () => {
      mockResendClient.emails.send = jest.fn().mockRejectedValue(
        new Error('Request timeout')
      );

      await expect(
        sendWelcomeEmail('user@example.com', 'User', 'https://example.com/verify')
      ).rejects.toThrow();
    });
  });

  describe('Failure Conditions - Invalid Parameters', () => {
    test('should attempt to send even with empty email', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('', 'User', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });

    test('should attempt to send even with empty name', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', '', 'https://example.com/verify');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });

    test('should attempt to send even with empty URL', async () => {
      mockResendClient.emails.send = jest.fn().mockResolvedValue({
        data: { id: 'email-123' },
        error: null
      });

      await sendWelcomeEmail('user@example.com', 'User', '');

      expect(mockResendClient.emails.send).toHaveBeenCalled();
    });
  });
});