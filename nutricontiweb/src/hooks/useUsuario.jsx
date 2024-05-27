import { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../firebase";

const useUsuario = (uid) => {
  const { firebase } = useContext(FirebaseContext)
  const [loading, setLoading] = useState(true);
  const [usuario, guardarUsuario] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.db.collection('usuarios').doc(uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const usuario = {
            id: doc.id,
            ...doc.data()
          };
          setLoading(false);
          guardarUsuario(usuario);
        } else {
          console.log('No such document!');
        }
      }, error => {
        console.log('Error getting document:', error);
      });

    return () => unsubscribe();
  }, [uid, firebase.db]);

  return { usuario, loading };
};

export default useUsuario;