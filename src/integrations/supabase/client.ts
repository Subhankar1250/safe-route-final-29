
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// These would be replaced with actual environment variables in production
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signInWithUsername = async (username: string, password: string) => {
  // This is a custom function since Supabase doesn't support username-only auth natively
  // We would need a custom RPC function on Supabase to handle this
  
  try {
    // Use the Supabase functions to authenticate
    const { data, error } = await supabase.rpc('authenticate_username', {
      p_username: username,
      p_password: password
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

// QR Token authentication for drivers
export const signInWithQrToken = async (token: string) => {
  try {
    // Use the Supabase functions to authenticate with QR token
    const { data, error } = await supabase.rpc('authenticate_qr_token', {
      p_token: token
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with QR token:', error);
    return { data: null, error };
  }
};

// Location tracking helpers
export const updateBusLocation = async (
  busNumber: string,
  driverId: string,
  latitude: number,
  longitude: number
) => {
  try {
    const { data, error } = await supabase
      .from('bus_locations')
      .upsert({
        bus_number: busNumber,
        driver_id: driverId,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        is_active: true
      });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating bus location:', error);
    return { data: null, error };
  }
};

// Get bus locations by route or bus number
export const getBusLocations = async (
  routeId?: string, 
  busNumber?: string
) => {
  try {
    let query = supabase
      .from('bus_locations')
      .select(`
        id,
        bus_number,
        driver:drivers(id, name),
        latitude,
        longitude,
        timestamp,
        is_active,
        route:routes(id, name)
      `);
    
    if (routeId) {
      query = query.eq('route.id', routeId);
    }
    
    if (busNumber) {
      query = query.eq('bus_number', busNumber);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting bus locations:', error);
    return { data: null, error };
  }
};

// Student tracking helpers
export const updateStudentStatus = async (
  studentId: string,
  busNumber: string,
  isOnBoard: boolean,
  timestamp: string
) => {
  try {
    const { data, error } = await supabase
      .from('student_tracking')
      .upsert({
        student_id: studentId,
        bus_number: busNumber,
        is_on_board: isOnBoard,
        timestamp,
        event_type: isOnBoard ? 'check_in' : 'check_out'
      });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating student status:', error);
    return { data: null, error };
  }
};

// Guardian data helpers
export const getStudentsByGuardian = async (guardianId: string) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id, name, grade, pickup_point,
        buses (bus_number, driver:drivers(name)),
        student_tracking (is_on_board, timestamp, event_type)
      `)
      .eq('guardian_id', guardianId);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting students by guardian:', error);
    return { data: null, error };
  }
};

export default supabase;
