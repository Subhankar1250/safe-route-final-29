
import { createAdminUser } from "@/services/firebase/admin";

/**
 * Initialize a real admin account in Firebase
 * This function should be run once during initial setup
 */
export const initializeRealAdmin = async () => {
  try {
    const adminEmail = "subhankar.ghorui1111@gmail.com";
    const adminPassword = "Suvo@1250";
    const adminName = "Subhankar Ghorui";
    
    console.log("Creating admin account...");
    // Check if we're connected to Firebase before proceeding
    if (!window.navigator.onLine) {
      throw new Error("No internet connection. Please check your network connection and try again.");
    }
    
    await createAdminUser(adminEmail, adminPassword, adminName);
    console.log("Admin account created successfully!");
    
    return true;
  } catch (error: any) {
    console.error("Failed to create admin account:", error);
    // Provide more detailed error messages for common issues
    if (error.code === 'auth/email-already-in-use') {
      console.log("Admin account already exists. You can login with the provided credentials.");
      return true; // Return true if the account already exists
    }
    
    return false;
  }
};
