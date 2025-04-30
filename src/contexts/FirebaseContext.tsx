
import React, { createContext, useContext } from 'react';
import { app, analytics, firestore, auth, database, storage } from '../config/firebase';

interface FirebaseContextType {
  app: typeof app;
  analytics: typeof analytics;
  firestore: typeof firestore;
  auth: typeof auth;
  database: typeof database;
  storage: typeof storage;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseContext.Provider
      value={{ app, analytics, firestore, auth, database, storage }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
