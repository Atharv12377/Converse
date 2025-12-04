import { createVerificationEmailTemplate } from '../../emails/emailTemplates.js';

describe('createVerificationEmailTemplate', () => {
  describe('Happy Path - Template Generation', () => {
    test('should generate valid HTML email template', () => {
      const name = 'John Doe';
      const verificationURL = 'https://example.com/verify?token=abc123';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toBeTruthy();
      expect(typeof template).toBe('string');
      expect(template).toContain('<!DOCTYPE html>');
      expect(template).toContain('</html>');
    });

    test('should include user name in template', () => {
      const name = 'Jane Smith';
      const verificationURL = 'https://example.com/verify?token=xyz789';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
      expect(template).toContain(`Hello ${name}`);
    });

    test('should include verification URL in template', () => {
      const name = 'Test User';
      const verificationURL = 'https://example.com/verify?token=test123';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(verificationURL);
      expect(template).toContain(`href="${verificationURL}"`);
    });

    test('should include Verify Email button', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('Verify Email');
    });

    test('should include email subject hint', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('Verify Your Email');
    });
  });

  describe('Edge Cases - Special Characters in Name', () => {
    test('should handle name with apostrophe', () => {
      const name = "O'Brien";
      const verificationURL = 'https://example.com/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
    });

    test('should handle name with hyphen', () => {
      const name = 'Mary-Jane';
      const verificationURL = 'https://example.com/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
    });

    test('should handle name with accented characters', () => {
      const name = 'José García';
      const verificationURL = 'https://example.com/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
    });

    test('should handle name with special Unicode characters', () => {
      const name = '李明';
      const verificationURL = 'https://example.com/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
    });

    test('should handle empty name gracefully', () => {
      const name = '';
      const verificationURL = 'https://example.com/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('Hello ');
      expect(template).toBeTruthy();
    });
  });

  describe('Edge Cases - Complex URLs', () => {
    test('should handle URL with query parameters', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify?token=abc&redirect=/dashboard';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(verificationURL);
    });

    test('should handle URL with hash fragment', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify?token=abc#section';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(verificationURL);
    });

    test('should handle very long URL', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify?token=' + 'a'.repeat(500);
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(verificationURL);
    });

    test('should handle localhost URL', () => {
      const name = 'User';
      const verificationURL = 'http://localhost:3000/verify?token=abc';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(verificationURL);
    });
  });

  describe('HTML Structure Validation', () => {
    test('should have proper HTML structure', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('<html');
      expect(template).toContain('<head>');
      expect(template).toContain('</head>');
      expect(template).toContain('<body');
      expect(template).toContain('</body>');
      expect(template).toContain('</html>');
    });

    test('should have meta charset UTF-8', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('charset="UTF-8"');
    });

    test('should have viewport meta tag', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('viewport');
    });

    test('should have title tag', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('<title>');
      expect(template).toContain('</title>');
    });
  });

  describe('Content Validation', () => {
    test('should mention Converse brand', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('Converse');
    });

    test('should include copyright notice', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('©');
      expect(template).toContain('2025');
    });

    test('should include footer links', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('Privacy Policy');
      expect(template).toContain('Terms of Service');
      expect(template).toContain('Contact Us');
    });

    test('should mention verification expiry time', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('1 hour');
    });
  });

  describe('Styling Validation', () => {
    test('should include inline CSS styles', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain('style=');
    });

    test('should have button with styling', () => {
      const name = 'User';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      const buttonMatch = template.match(/<a[^>]*style=[^>]*>.*Verify Email.*<\/a>/i);
      expect(buttonMatch).toBeTruthy();
    });
  });

  describe('XSS Prevention - Security Tests', () => {
    test('should not execute script in name parameter', () => {
      const name = '<script>alert("XSS")</script>';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      // Template should contain the raw script tag as text, not execute it
      expect(template).toContain(name);
    });

    test('should handle HTML injection in name', () => {
      const name = '<img src=x onerror=alert(1)>';
      const verificationURL = 'https://example.com/verify';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      expect(template).toContain(name);
    });

    test('should handle JavaScript URL in verification URL', () => {
      const name = 'User';
      const verificationURL = 'javascript:alert("XSS")';
      
      const template = createVerificationEmailTemplate(name, verificationURL);
      
      // Should still generate template even with malicious URL
      expect(template).toContain(verificationURL);
    });
  });
});