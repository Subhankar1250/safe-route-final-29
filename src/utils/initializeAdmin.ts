
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

    // Log Firebase initialization status
    console.log("Checking Firebase connection status...");
    
    // Add a delay to ensure Firebase is properly initialized
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Attempting to create admin user...");
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
    
    if (error.code === 'auth/network-request-failed') {
      console.error("Network request failed. Please check your internet connection and Firebase configuration.");
    }
    
    if (error.message && error.message.includes("Firebase")) {
      console.error("Firebase error:", error.message);
    }
    
    throw error; // Re-throw the error so it can be caught by the calling function
  }
};
