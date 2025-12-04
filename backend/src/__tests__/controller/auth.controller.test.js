import { signup } from '../../controller/auth.controller.js';

// Mock dependencies
const mockUser = {
  findOne: null,
  prototype: {
    save: null
  }
};

const mockValidateUserData = jest.fn();
const mockSendWelcomeEmail = jest.fn();
const mockBcryptGenSalt = jest.fn();
const mockBcryptHash = jest.fn();

jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: mockUser
}));

jest.unstable_mockModule('../../utils/validateUserData.util.js', () => ({
  default: mockValidateUserData
}));

jest.unstable_mockModule('../../emails/emailHandler.js', () => ({
  sendWelcomeEmail: mockSendWelcomeEmail
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    genSalt: mockBcryptGenSalt,
    hash: mockBcryptHash
  },
  genSalt: mockBcryptGenSalt,
  hash: mockBcryptHash
}));

describe('signup controller', () => {
  let req, res, consoleLogSpy;

  beforeEach(() => {
    // Setup request and response mocks
    req = {
      body: {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();
    mockValidateUserData.mockImplementation(() => {});
    mockBcryptGenSalt.mockResolvedValue('salt');
    mockBcryptHash.mockResolvedValue('hashedPassword');
    mockSendWelcomeEmail.mockResolvedValue();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Happy Path - Successful Signup', () => {
    test('should create user successfully for adult (age >= 18)', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com',
        photoUrl: null
      });

      // Mock User constructor
      const UserConstructor = function(data) {
        this.fullname = data.fullname;
        this.email = data.email;
        this.photoUrl = null;
        this._id = 'user123';
        this.save = mockSave;
      };
      mockUser.mockImplementation = UserConstructor;
      global.User = UserConstructor;

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User Created, Verify through Email to get started',
          fullname: expect.any(String),
          email: expect.any(String)
        })
      );
    });

    test('should set accountType to "minor" for age < 18', async () => {
      req.body.age = 15;
      mockUser.findOne = jest.fn().mockResolvedValue(null);

      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'Young User',
        email: 'young@example.com',
        photoUrl: null
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.fullname = data.fullname;
        this.email = data.email;
        this.photoUrl = null;
        this._id = 'user123';
        this.save = mockSave;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.accountType).toBe('minor');
    });

    test('should set accountType to "adult" for age = 18', async () => {
      req.body.age = 18;
      mockUser.findOne = jest.fn().mockResolvedValue(null);

      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'Adult User',
        email: 'adult@example.com',
        photoUrl: null
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.fullname = data.fullname;
        this.email = data.email;
        this.photoUrl = null;
        this._id = 'user123';
        this.save = mockSave;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.accountType).toBe('adult');
    });

    test('should hash password before saving', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        this.save = mockSave;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(mockBcryptGenSalt).toHaveBeenCalledWith(10);
      expect(mockBcryptHash).toHaveBeenCalledWith('StrongP@ssw0rd123', 'salt');
    });

    test('should generate verification token', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.verificationToken).toBeTruthy();
      expect(typeof userDataCapture.verificationToken).toBe('string');
    });

    test('should set verification token expiry to 1 hour', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      const beforeTime = Date.now();
      await signup(req, res);
      const afterTime = Date.now();

      const expectedExpiry = beforeTime + 1000 * 60 * 60;
      expect(userDataCapture.verificationTokenExpiry).toBeGreaterThanOrEqual(expectedExpiry);
      expect(userDataCapture.verificationTokenExpiry).toBeLessThanOrEqual(afterTime + 1000 * 60 * 60);
    });

    test('should attempt to send welcome email', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(mockSendWelcomeEmail).toHaveBeenCalledWith(
        'john@example.com',
        'John Doe',
        expect.stringContaining('?token=')
      );
    });
  });

  describe('Edge Cases - Existing User', () => {
    test('should return 200 if user already exists', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue({
        email: 'john@example.com'
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User Already Exist'
      });
    });

    test('should not create new user if email exists', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue({
        email: 'john@example.com'
      });

      const mockSave = jest.fn();
      const UserConstructor = function() {
        this.save = mockSave;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(mockSave).not.toHaveBeenCalled();
    });

    test('should not send email if user already exists', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue({
        email: 'john@example.com'
      });

      await signup(req, res);

      expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases - Boundary Ages', () => {
    test('should handle age 17 as minor', async () => {
      req.body.age = 17;
      mockUser.findOne = jest.fn().mockResolvedValue(null);

      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'minor@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.accountType).toBe('minor');
    });

    test('should handle age 0 as minor', async () => {
      req.body.age = 0;
      mockUser.findOne = jest.fn().mockResolvedValue(null);

      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'baby@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.accountType).toBe('minor');
    });

    test('should handle age 110 as adult', async () => {
      req.body.age = 110;
      mockUser.findOne = jest.fn().mockResolvedValue(null);

      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'senior@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.accountType).toBe('adult');
    });
  });

  describe('Failure Conditions - Validation Errors', () => {
    test('should return 400 if validation fails', async () => {
      mockValidateUserData.mockImplementation(() => {
        throw new Error('Validation error');
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error While Signing Up'
        })
      );
    });

    test('should not query database if validation fails', async () => {
      mockValidateUserData.mockImplementation(() => {
        throw new Error('Validation error');
      });
      mockUser.findOne = jest.fn();

      await signup(req, res);

      expect(mockUser.findOne).not.toHaveBeenCalled();
    });
  });

  describe('Failure Conditions - Database Errors', () => {
    test('should return 400 if database query fails', async () => {
      mockUser.findOne = jest.fn().mockRejectedValue(new Error('DB Error'));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error While Signing Up'
        })
      );
    });

    test('should return 400 if user save fails', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const mockSave = jest.fn().mockRejectedValue(new Error('Save failed'));
      const UserConstructor = function() {
        this.save = mockSave;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Failure Conditions - Email Sending Errors', () => {
    test('should still return 201 even if email sending fails', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      mockSendWelcomeEmail.mockRejectedValue(new Error('Email failed'));

      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
        this._id = 'user123';
      };
      global.User = UserConstructor;

      await signup(req, res);

      // First call should be 201 for user creation
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 400 after 201 if email fails', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      mockSendWelcomeEmail.mockRejectedValue(new Error('Email failed'));

      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
        this._id = 'user123';
      };
      global.User = UserConstructor;

      await signup(req, res);

      // Should have both status calls
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Security - Password Hashing', () => {
    test('should never store plaintext password', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'secure@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(userDataCapture.password).not.toBe(req.body.password);
      expect(userDataCapture.password).toBe('hashedPassword');
    });

    test('should use bcrypt with salt rounds of 10', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'secure@example.com'
      });

      const UserConstructor = function() {
        this.save = mockSave;
        this.email = 'test@test.com';
        this.fullname = 'Test';
      };
      global.User = UserConstructor;

      await signup(req, res);

      expect(mockBcryptGenSalt).toHaveBeenCalledWith(10);
    });
  });

  describe('Security - Verification Token', () => {
    test('should hash verification token before storing', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'token@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      // Stored token should be hashed (64 hex characters for sha256)
      expect(userDataCapture.verificationToken).toHaveLength(64);
    });

    test('should send unhashed token in email URL', async () => {
      mockUser.findOne = jest.fn().mockResolvedValue(null);
      
      const userDataCapture = {};
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        fullname: 'John Doe',
        email: 'john@example.com'
      });

      const UserConstructor = function(data) {
        Object.assign(userDataCapture, data);
        this.save = mockSave;
        this.email = data.email;
        this.fullname = data.fullname;
      };
      global.User = UserConstructor;

      await signup(req, res);

      const emailCallArgs = mockSendWelcomeEmail.mock.calls[0];
      const verificationURL = emailCallArgs[2];
      const tokenInURL = verificationURL.split('?token=')[1];

      // Token in URL should be different from hashed token in DB
      expect(tokenInURL).not.toBe(userDataCapture.verificationToken);
      expect(tokenInURL).toHaveLength(64); // 32 bytes as hex
    });
  });
});