
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
    await createAdminUser(adminEmail, adminPassword, adminName);
    console.log("Admin account created successfully!");
    
    return true;
  } catch (error: any) {
    console.error("Failed to create admin account:", error.message);
    return false;
  }
};
