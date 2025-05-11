
import { 
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
import { db } from './config';

// Student database functions
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

// Driver database functions
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
