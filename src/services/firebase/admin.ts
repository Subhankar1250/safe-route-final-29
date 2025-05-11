
import { 
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/contexts/AuthContext';

// Create Admin User - Special function for admin creation
export const createAdminUser = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // First check if an admin already exists with this email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('role', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('An admin with this email already exists');
    }
    
    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Store admin data in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      name,
      role: 'admin',
      username: email, // Using email as the default username
      isAdmin: true,
      createdAt: new Date()
    });
    
    return {
      id: firebaseUser.uid,
      email,
      name,
      role: 'admin'
    };
  } catch (error: any) {
    console.error('Admin creation error:', error);
    throw new Error(error.message || 'Failed to create admin user');
  }
};
