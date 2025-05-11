
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';
import { User } from '@/contexts/AuthContext';

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

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

export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth);
};

// Current user observer
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Database functions
export const createStudent = async (studentData: any) => {
  const studentRef = doc(collection(db, 'students'));
  await setDoc(studentRef, {
    ...studentData,
    createdAt: new Date()
  });
  return studentRef.id;
};

export const getStudents = async () => {
  const studentsRef = collection(db, 'students');
  const snapshot = await getDocs(studentsRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateStudent = async (id: string, data: any) => {
  const studentRef = doc(db, 'students', id);
  await updateDoc(studentRef, data);
};

export const deleteStudent = async (id: string) => {
  const studentRef = doc(db, 'students', id);
  await deleteDoc(studentRef);
};

// Similar functions for drivers, routes, etc.
export const createDriver = async (driverData: any) => {
  const driverRef = doc(collection(db, 'drivers'));
  await setDoc(driverRef, {
    ...driverData,
    createdAt: new Date()
  });
  return driverRef.id;
};

export const getDrivers = async () => {
  const driversRef = collection(db, 'drivers');
  const snapshot = await getDocs(driversRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
