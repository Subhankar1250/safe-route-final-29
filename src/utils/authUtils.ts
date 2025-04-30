
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

/**
 * Updates admin password
 * @param currentPassword Current password for verification
 * @param newPassword New password to set
 * @returns Object with success status and message
 */
export function updateAdminPassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
  // In a real app, this would update the password in a secure database
  // For this demo, we're validating against the hardcoded password
  const ADMIN_CREDENTIALS = {
    username: "admin123",
    password: "SafeRoute@2023"
  };
  
  if (currentPassword !== ADMIN_CREDENTIALS.password) {
    return { 
      success: false, 
      message: "Current password is incorrect" 
    };
  }
  
  if (newPassword.length < 8) {
    return { 
      success: false, 
      message: "New password must be at least 8 characters long" 
    };
  }
  
  // In a real app, this would update the password in the database
  // For demo purposes, we'll just return success
  return { 
    success: true, 
    message: "Password updated successfully" 
  };
}

/**
 * Updates guardian credentials
 * @param guardianId The ID of the guardian
 * @param newUsername Optional new username
 * @param newPassword Optional new password
 * @returns Object with success status and message
 */
export function updateGuardianCredentials(
  studentId: string,
  newUsername?: string,
  newPassword?: string
): { success: boolean; message: string; username?: string; password?: string } {
  // In a real app, this would update the credentials in the database
  // For this demo, we'll just generate new credentials if requested
  
  if (!newUsername && !newPassword) {
    return {
      success: false,
      message: "No changes requested"
    };
  }
  
  // For demonstration purposes, we'll return the new credentials
  // In a real app, this would update the database
  return {
    success: true,
    message: "Guardian credentials updated successfully",
    username: newUsername,
    password: newPassword
  };
}
