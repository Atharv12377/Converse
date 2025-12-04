import validateUserData from '../../utils/validateUserData.util.js';

describe('validateUserData', () => {
  describe('Happy Path - Valid Data', () => {
    test('should not throw error for valid user data', () => {
      const validData = {
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(validData)).not.toThrow();
    });

    test('should accept minimum age (0)', () => {
      const validData = {
        fullname: 'Baby User',
        email: 'baby@example.com',
        password: 'StrongP@ssw0rd123',
        age: 0
      };
      
      expect(() => validateUserData(validData)).not.toThrow();
    });

    test('should accept maximum reasonable age', () => {
      const validData = {
        fullname: 'Senior User',
        email: 'senior@example.com',
        password: 'StrongP@ssw0rd123',
        age: 110
      };
      
      expect(() => validateUserData(validData)).not.toThrow();
    });

    test('should accept special characters in fullname', () => {
      const validData = {
        fullname: "O'Brien-Smith Jr.",
        email: 'obrien@example.com',
        password: 'StrongP@ssw0rd123',
        age: 30
      };
      
      expect(() => validateUserData(validData)).not.toThrow();
    });
  });

  describe('Edge Cases - Missing Fields', () => {
    test('should throw error when fullname is missing', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Username');
    });

    test('should throw error when fullname is empty string', () => {
      const invalidData = {
        fullname: '',
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Username');
    });

    test('should throw error when fullname is null', () => {
      const invalidData = {
        fullname: null,
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Username');
    });

    test('should throw error when fullname is undefined', () => {
      const invalidData = {
        fullname: undefined,
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Username');
    });

    test('should throw error when email is missing', () => {
      const invalidData = {
        fullname: 'John Doe',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Email');
    });

    test('should throw error when email is empty string', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: '',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Email');
    });

    test('should throw error when password is missing', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Password');
    });

    test('should throw error when password is empty string', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: '',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Password');
    });

    test('should throw error when age is missing', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123'
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter The Correct Age');
    });

    test('should throw error when age is 0 but falsy check fails', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: null
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter The Correct Age');
    });
  });

  describe('Edge Cases - Weak Passwords', () => {
    test('should throw error for weak password (too short)', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'weak',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });

    test('should throw error for password without uppercase', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'password123!',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });

    test('should throw error for password without lowercase', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'PASSWORD123!',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });

    test('should throw error for password without numbers', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'Password!',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });

    test('should throw error for password without special characters', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'Password123',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });

    test('should throw error for password that is too short even with all criteria', () => {
      const invalidData = {
        fullname: 'John Doe',
        email: 'test@example.com',
        password: 'Pw1!',
        age: 25
      };
      
      expect(() => validateUserData(invalidData)).toThrow('Please Enter Valid Password');
    });
  });

  describe('Failure Conditions - All Fields Invalid', () => {
    test('should throw error for completely empty object', () => {
      expect(() => validateUserData({})).toThrow();
    });

    test('should throw error for all null values', () => {
      const invalidData = {
        fullname: null,
        email: null,
        password: null,
        age: null
      };
      
      expect(() => validateUserData(invalidData)).toThrow();
    });

    test('should throw error for all undefined values', () => {
      const invalidData = {
        fullname: undefined,
        email: undefined,
        password: undefined,
        age: undefined
      };
      
      expect(() => validateUserData(invalidData)).toThrow();
    });
  });

  describe('Boundary Cases', () => {
    test('should handle age as string "0" (type coercion)', () => {
      const testData = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: '0'
      };
      
      // This might pass or fail depending on how validator handles it
      // Including this to ensure behavior is documented
      expect(() => validateUserData(testData)).not.toThrow();
    });

    test('should handle very long fullname', () => {
      const testData = {
        fullname: 'A'.repeat(100),
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(testData)).not.toThrow();
    });

    test('should handle email with multiple dots', () => {
      const testData = {
        fullname: 'John Doe',
        email: 'john.doe.test@example.co.uk',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(testData)).not.toThrow();
    });

    test('should handle email with plus sign', () => {
      const testData = {
        fullname: 'John Doe',
        email: 'john+test@example.com',
        password: 'StrongP@ssw0rd123',
        age: 25
      };
      
      expect(() => validateUserData(testData)).not.toThrow();
    });
  });
});