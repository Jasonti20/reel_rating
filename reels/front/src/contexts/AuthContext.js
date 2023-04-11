import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function updateUserProfile(user, profile) {
    return updateProfile(user, profile);
  }

  function getCurrentUserId() {
    return currentUserId;
  }
  function signInWithGoogle () {
    setLoading(true);
    signInWithPopup(auth, new GoogleAuthProvider())
    .then((res) => console.log(res))
    .catch((err) => setError(err.code))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
    } else {
      setCurrentUserId(null);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    currentUserId,
    error,
    setError,
    login,
    register,
    logout,
    updateUserProfile,
    getCurrentUserId,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
