import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";

import Usuario from "../ui/usuario";

const Usuarios = () => {
  
  const [usuarios, guardarUsuarios] = useState([]);
  const [modalExito, setModalExito] = useState(false);
  const [createdUserName, setCreatedUserName] = useState('Usuario');

  const { firebase } = useContext(FirebaseContext);
  
  useEffect(() => {
    const obtenerUsuarios = () => {
      try {
        firebase.db.collection('usuarios').onSnapshot(handleSnapshot);
      } catch (error) {
        console.log(error)
      }
    }
    obtenerUsuarios();    
  }, []);
  
  function handleSnapshot(snapshot) {
    const usuarios = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });
    
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
      <div className="sm:flex sm:flex-wrap -mx-3">
        {usuarios.map(usuario => (
          <Usuario
            key={usuario.id}
            usuario={usuario}
            modalExito={modalExito}
            setModalExito={setModalExito}
            createdUserName={createdUserName}
            setCreatedUserName={setCreatedUserName}
          />
        ))}
      </div >
    </>
  );
};

export default Usuarios;
