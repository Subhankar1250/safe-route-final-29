
/**
 * Mock Supabase client file
 * This file exists to prevent import errors in components that haven't yet been 
 * fully migrated away from Supabase.
 * 
 * It does not actually connect to Supabase or provide any functionality.
 */

export const supabase = {
  // Mock methods that might be used in the codebase
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: [],
        error: null,
      }),
    }),
    insert: () => ({
      data: null,
      error: null,
    }),
    update: () => ({
      eq: () => ({
        data: null,
        error: null,
      }),
    }),
    delete: () => ({
      eq: () => ({
        data: null,
        error: null,
      }),
    }),
  }),
};

export default supabase;
