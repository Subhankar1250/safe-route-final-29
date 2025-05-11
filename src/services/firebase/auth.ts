
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/contexts/AuthContext';

// Auth functions
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    if (!userData || !userData.role) {
      throw new Error('User data not found');
    }
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: userData.name || '',
      role: userData.role
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

export const loginWithUsername = async (username: string, password: string, role: string): Promise<User> => {
  try {
    // Query Firestore to find user by username
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('User not found');
    }
    
    // Get the email from the found user document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email;
    
    if (!email) {
      throw new Error('User email not found');
    }
    
    // Log in with email
    return await loginWithEmail(email, password);
  } catch (error: any) {
    console.error('Username login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

export const registerUser = async (email: string, password: string, name: string, role: string, username?: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      name,
      role,
      username: username || email,
      createdAt: new Date()
    });
    
    return {
      id: firebaseUser.uid,
      email,
      name,
      role: role as 'admin' | 'driver' | 'guardian'
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth);
};

// Current user observer
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
