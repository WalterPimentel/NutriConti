import { useEffect, useState, useContext } from "react";
import { FirebaseContext } from '../../firebase'
import Orden from "../ui/Orden";

const Ordenes = () => {

  // Context con las opereaciones de Firebase
  const { firebase } = useContext(FirebaseContext);

  // State con las ordenes
  const [ordenes, guardarOrdenes] = useState([]);

  useEffect(() => {
    const obtenerOrdenes = () => {
      firebase.db.collection('ordenes')
        .where('completado', '==', false)
        .onSnapshot(manejarSnapshot);
    }
    obtenerOrdenes();
  }, []);

  function manejarSnapshot(snapshot) {
    const ordenes = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    ordenes.sort((a, b) => {
      const fechaA = new Date(a.creado);
      const fechaB = new Date(b.creado);

      if (fechaA < fechaB) {
        return 1;
      }
      if (fechaA > fechaB) {
        return -1;
      }
      return 0;
    });

    guardarOrdenes(ordenes);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Órdenes</h1>
      <div className="sm:flex sm:flex-wrap -mx-3">
        {ordenes.map(orden => (
          <Orden
            key={orden.id}
            orden={orden}
          />
        ))}
      </div>
    </>
  );
};

export default Ordenes;
