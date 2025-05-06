
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates an admin user in the system
 * This function should only be used by the system administrator
 * Run this function from the browser console when logged in as a super admin
 */
export const createAdminUser = async (email: string, password: string, name: string) => {
  try {
    // Step 1: Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          name,
        },
      }
    });

    if (authError) throw authError;
    
    // Step 2: Check if user was created successfully
    if (!authData.user) {
      throw new Error('Failed to create user in auth system');
    }
    
    // Step 3: Update the users table to ensure role is set to admin
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', authData.user.id);
    
    if (updateError) throw updateError;
    
    console.log('Admin user created successfully:', email);
    return { success: true, user: authData.user };
    
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * For use in the browser console:
 * 
 * To create an admin user, open your browser console when logged in as a super admin and run:
 * 
 * import { createAdminUser } from './src/utils/adminCreator';
 * createAdminUser('admin@sishu-tirtha.app', 'securepassword', 'Admin User');
 */
