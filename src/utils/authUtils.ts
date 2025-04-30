
/**
 * Helper functions for authentication
 */

interface Credentials {
  username: string;
  password: string;
  email?: string; // Optional for backward compatibility
}

/**
 * Generates a unique username and password for a new user
 * @param name The full name of the user
 * @param role The role of the user (guardian, driver, admin)
 * @returns An object containing the generated username and password
 */
export const generateCredentials = (name: string, role: 'guardian' | 'driver' | 'admin'): Credentials => {
  // Generate username based on name (lowercase, no spaces, add random digits)
  const nameParts = name.toLowerCase().split(' ');
  const baseUsername = nameParts.join('');
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  const username = baseUsername + randomDigits;
  
  // Generate a secure password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return { username, password };
};

/**
 * Validates a username
 * @param username The username to validate
 * @returns True if the username is valid, false otherwise
 */
export const validateUsername = (username: string): boolean => {
  // Username must be at least 4 characters long and contain only alphanumeric characters
  return username.length >= 4 && /^[a-zA-Z0-9]+$/.test(username);
};

/**
 * Validates a password
 * @param password The password to validate
 * @returns True if the password is valid, false otherwise
 */
export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  return password.length >= 8;
};
