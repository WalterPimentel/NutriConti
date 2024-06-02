import { useState, useEffect } from 'react';
import firebase from '../firebase';

export default function useAuth() {
  const [auth, setAuth] = useState({
    loading: true,
    user: null,
    userRole: localStorage.getItem('userRole') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const docUnsubscribe = firebase.db.collection('usuarios').doc(user.uid)
          .onSnapshot(doc => {
            if (!doc.exists) {
              firebase.auth().signOut();
              setAuth({ loading: false, user: null, userRole: null, isAuthenticated: false, error: null });
              localStorage.setItem('isAuthenticated', 'false');
            } else {
              const role = doc.data().puesto;
              localStorage.setItem('userRole', role);
              setAuth({ loading: false, user, userRole: role, isAuthenticated: true, error: null });
              localStorage.setItem('isAuthenticated', 'true');
            }
          }, error => {
            console.error('Error al obtener documento:', error);
            setAuth(prevState => ({
              ...prevState,
              loading: false,
              error: 'Error al obtener documento',
            }));
          });

        return () => {
          unsubscribe();
          docUnsubscribe();
        };
      } else {
        setAuth({ loading: false, user: null, userRole: null, isAuthenticated: false, error: null });
        localStorage.setItem('isAuthenticated', 'false');
      }
    });
  }, []);

  return auth;
}
