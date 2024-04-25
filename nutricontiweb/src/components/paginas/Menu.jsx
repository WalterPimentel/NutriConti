import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";

import Platillo from "../ui/platillo";

const Menu = () => {

  // Definir el state para los platillos
  const [platillos, guardarPlatillos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  // consultar la BD al cargar
  useEffect(() => {
    const obtenerPlatillos = () => {
      try {
        firebase.db.collection('productos').onSnapshot(handleSnapshot);
        //firebase.db.collection('productos').get(); para hacer una consulta (no tiempo real)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerPlatillos();
  }, []);

  // Snapshot nos permite utilizar la BD en tiempo real de firestore
  function handleSnapshot(snapshot) {
    const platillos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });

    // almacenar los resultados en el state
    guardarPlatillos(platillos);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Menú</h1>
      <Link
        to="/nuevo-platillo"
        className="bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Agregar Platillo
      </Link>

      {platillos.map(platillo => (
        <Platillo

          key={platillo.id}
          platillo={platillo}

        />
      ))}

    </>
  );
};

export default Menu;
