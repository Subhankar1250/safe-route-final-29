
/**
 * Utility functions for authentication and credential generation
 */

/**
 * Generates a secure random password of specified length
 * @param length Length of the password to generate (default: 10)
 * @returns A string containing the generated password
 */
export const generateSecurePassword = (length: number = 10): string => {
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '@#$%^&*!';
  
  const allChars = lowerChars + upperChars + numbers + specialChars;
  
  // Ensure at least one character of each type
  let password = 
    lowerChars[Math.floor(Math.random() * lowerChars.length)] +
    upperChars[Math.floor(Math.random() * upperChars.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest of the password with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Generates a username based on the provided name
 * @param name Full name of the user
 * @returns A username string
 */
export const generateUsername = (name: string): string => {
  // Remove special characters, replace spaces with dots, and convert to lowercase
  const sanitized = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '.');
  
  // Generate a random number suffix
  const randomSuffix = Math.floor(Math.random() * 999);
  
  return `${sanitized.toLowerCase()}.${randomSuffix}`;
};

/**
 * Generates temporary login credentials for a user
 * @param name Full name of the user
 * @param role Role of the user (guardian, driver, admin)
 * @returns An object containing email, username and password
 */
export const generateCredentials = (name: string, role: 'guardian' | 'driver' | 'admin') => {
  const username = generateUsername(name);
  const password = generateSecurePassword();
  const email = `${username}@example.com`;
  
  return {
    email,
    username,
    password,
    role
  };
};
