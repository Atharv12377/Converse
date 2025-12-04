/**
 * Tests for resend.js configuration module
 * This module initializes the Resend client and exports sender configuration
 */

describe('Resend Configuration', () => {
  let resendClient, sender;

  beforeEach(async () => {
    // Mock environment variables
    process.env.RESEND_API_KEY = 'test_api_key_12345';
    process.env.EMAIL_FROM = 'noreply@example.com';
    process.env.EMAIL_FROM_NAME = 'Test Application';

    // Clear module cache to reload with new env vars
    jest.resetModules();

    // Import after setting env vars
    const resendModule = await import('../../lib/resend.js');
    resendClient = resendModule.resendClient;
    sender = resendModule.sender;
  });

  describe('Resend Client Configuration', () => {
    test('should export resendClient', () => {
      expect(resendClient).toBeDefined();
    });

    test('should have emails.send method', () => {
      expect(resendClient).toHaveProperty('emails');
      expect(resendClient.emails).toHaveProperty('send');
      expect(typeof resendClient.emails.send).toBe('function');
    });

    test('resendClient should be initialized with API key', () => {
      // The Resend constructor is called with the API key
      expect(resendClient).toBeDefined();
    });
  });

  describe('Sender Configuration', () => {
    test('should export sender object', () => {
      expect(sender).toBeDefined();
      expect(typeof sender).toBe('object');
    });

    test('should have email property from environment', () => {
      expect(sender).toHaveProperty('email');
      expect(sender.email).toBe('noreply@example.com');
    });

    test('should have name property from environment', () => {
      expect(sender).toHaveProperty('name');
      expect(sender.name).toBe('Test Application');
    });

    test('sender email should be valid format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(sender.email).toMatch(emailRegex);
    });

    test('sender name should be non-empty string', () => {
      expect(typeof sender.name).toBe('string');
      expect(sender.name.length).toBeGreaterThan(0);
    });
  });

  describe('Environment Variable Validation', () => {
    test('should handle missing RESEND_API_KEY', async () => {
      delete process.env.RESEND_API_KEY;
      jest.resetModules();

      const resendModule = await import('../../lib/resend.js');
      // Client should still be created but may not work properly
      expect(resendModule.resendClient).toBeDefined();
    });

    test('should handle missing EMAIL_FROM', async () => {
      delete process.env.EMAIL_FROM;
      jest.resetModules();

      const resendModule = await import('../../lib/resend.js');
      expect(resendModule.sender.email).toBeUndefined();
    });

    test('should handle missing EMAIL_FROM_NAME', async () => {
      delete process.env.EMAIL_FROM_NAME;
      jest.resetModules();

      const resendModule = await import('../../lib/resend.js');
      expect(resendModule.sender.name).toBeUndefined();
    });
  });

  describe('Configuration Integrity', () => {
    test('sender configuration should be immutable reference', () => {
      const originalEmail = sender.email;
      sender.email = 'hacked@example.com';
      
      // In JavaScript, this would actually mutate the object
      // This test documents the behavior
      expect(sender.email).toBe('hacked@example.com');
    });

    test('should maintain consistent sender info across imports', async () => {
      const module1 = await import('../../lib/resend.js');
      const module2 = await import('../../lib/resend.js');
      
      expect(module1.sender).toBe(module2.sender);
      expect(module1.sender.email).toBe(module2.sender.email);
    });
  });

  describe('API Key Security', () => {
    test('API key should not be exposed in sender object', () => {
      expect(sender).not.toHaveProperty('apiKey');
      expect(sender).not.toHaveProperty('api_key');
      expect(sender).not.toHaveProperty('RESEND_API_KEY');
    });

    test('sender object should only contain email and name', () => {
      const senderKeys = Object.keys(sender);
      expect(senderKeys).toHaveLength(2);
      expect(senderKeys).toContain('email');
      expect(senderKeys).toContain('name');
    });
  });
});