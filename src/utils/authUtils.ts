
/**
 * Generates secure credentials based on name and role
 * @param name The name to generate credentials for
 * @param role The role (guardian, driver, admin)
 * @returns An object containing generated username and password
 */
export function generateCredentials(name: string, role: string): { username: string; password: string } {
  // Remove spaces and special chars, then take first part of name if it contains spaces
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Create a deterministic but seemingly random number based on the name and role
  const nameSum = cleanName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const randomNum = ((nameSum * 13) % 10000).toString().padStart(4, '0');
  
  // Create username with role prefix and name
  let username = '';
  if (role === 'guardian') {
    username = `SishuTirtha${cleanName}${randomNum}`;
  } else {
    username = `${role}_${cleanName}${randomNum}`;
  }
  
  // Generate a password with some complexity
  const specialChars = ['!', '@', '#', '$', '%', '&'];
  const randomSpecialChar = specialChars[nameSum % specialChars.length];
  const password = `${cleanName.substring(0, 4)}${randomSpecialChar}${randomNum}`;
  
  return {
    username,
    password
  };
}

/**
 * Validates admin credentials
 * @param username The username to check
 * @param password The password to check
 * @returns Boolean indicating if credentials are valid
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  // Admin credentials - same as in Login.tsx
  const ADMIN_CREDENTIALS = {
    username: "admin123",
    password: "SafeRoute@2023"
  };
  
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}
