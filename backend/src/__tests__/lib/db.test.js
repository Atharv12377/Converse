import { connectDB } from '../../lib/db.js';

// Mock mongoose
const mockMongooseConnect = jest.fn();
const mockProcessExit = jest.fn();

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: mockMongooseConnect
  },
  connect: mockMongooseConnect
}));

describe('connectDB', () => {
  let consoleLogSpy, consoleErrorSpy, originalProcessExit;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    originalProcessExit = process.exit;
    process.exit = mockProcessExit;
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    process.exit = originalProcessExit;
  });

  describe('Happy Path - Successful Connection', () => {
    test('should connect to database successfully', async () => {
      mockMongooseConnect.mockResolvedValue(undefined);

      await connectDB();

      expect(mockMongooseConnect).toHaveBeenCalledTimes(1);
      expect(mockMongooseConnect).toHaveBeenCalledWith(process.env.MONGO_URI);
    });

    test('should log success message on connection', async () => {
      mockMongooseConnect.mockResolvedValue(undefined);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith('Database Connected');
    });

    test('should not call process.exit on success', async () => {
      mockMongooseConnect.mockResolvedValue(undefined);

      await connectDB();

      expect(mockProcessExit).not.toHaveBeenCalled();
    });
  });

  describe('Failure Conditions - Connection Errors', () => {
    test('should handle connection error', async () => {
      const error = new Error('Connection failed');
      mockMongooseConnect.mockRejectedValue(error);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error Connecting to databsase')
      );
    });

    test('should call process.exit(1) on error', async () => {
      const error = new Error('Connection failed');
      mockMongooseConnect.mockRejectedValue(error);

      await connectDB();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    test('should handle network timeout error', async () => {
      const error = new Error('Network timeout');
      mockMongooseConnect.mockRejectedValue(error);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error Connecting to databsase')
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    test('should handle authentication error', async () => {
      const error = new Error('Authentication failed');
      mockMongooseConnect.mockRejectedValue(error);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error Connecting to databsase')
      );
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    test('should handle invalid connection string error', async () => {
      const error = new Error('Invalid connection string');
      mockMongooseConnect.mockRejectedValue(error);

      await connectDB();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe('Edge Cases - Environment Variables', () => {
    test('should use MONGO_URI from environment', async () => {
      process.env.MONGO_URI = 'mongodb://test:27017/testdb';
      mockMongooseConnect.mockResolvedValue(undefined);

      await connectDB();

      expect(mockMongooseConnect).toHaveBeenCalledWith('mongodb://test:27017/testdb');
    });

    test('should handle undefined MONGO_URI', async () => {
      const originalUri = process.env.MONGO_URI;
      delete process.env.MONGO_URI;
      mockMongooseConnect.mockRejectedValue(new Error('No URI provided'));

      await connectDB();

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      process.env.MONGO_URI = originalUri;
    });
  });
});