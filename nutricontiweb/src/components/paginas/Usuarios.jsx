import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";

import Usuario from "../ui/usuario";

const Usuarios = () => {

  // Definir el state para los usuarios
  const [usuarios, guardarUsuarios] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  // consultar la BD al cargar
  useEffect(() => {
    const obtenerUsuarios = () => {
      try {
        firebase.db.collection('usuarios').onSnapshot(handleSnapshot);
      } catch (error) {
        console.log(error)
      }
    }
    obtenerUsuarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Snapshot nos permite utilizar la BD en tiempo real de firestore
  function handleSnapshot(snapshot) {
    const usuarios = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });

    // almacenar los resultados en el state
    guardarUsuarios(usuarios);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Usuarios</h1>
      <Link
        to="/nuevo-usuario"
        className="bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Agregar Usuario
      </Link>

      {usuarios.map(usuario => (
          <Usuario
            key={usuario.id}
            usuario={usuario}
          />
        ))}

    </>
  );
};

export default Usuarios;
