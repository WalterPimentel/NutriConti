import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from '../../firebase'
import Orden from "../ui/Orden";

const OrdenesPasadas = () => {

  const { firebase } = useContext(FirebaseContext);

  const [ordenes, guardarOrdenes] = useState([]);

  useEffect(() => {
    const obtenerOrdenes = () => {
      firebase.db.collection('ordenes')
        .where('completado', '==', true)
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

  const mostrarHeading = (fecha, i, ordenes) => {
    if (i > 0) {
      const fechaAnterior = new Date(ordenes[i - 1].creado);
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      const fechaAnteriorFormateada = fechaAnterior.toLocaleDateString('es-ES', opciones);

      if (fechaAnteriorFormateada !== fecha) {
        return (
          <div className="p-2 w-full mb-2" style={{ backgroundColor: '#556B2F' }}>
            <h1 className="text-white text-lg font-bold">{fecha}</h1>
          </div>
        );
      }
    } else {
      return (
        <div className="p-2 w-full mb-2" style={{ backgroundColor: '#556B2F' }}>
          <h1 className="text-white text-lg font-bold">{fecha}</h1>
        </div>
      );
    }
  };

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Órdenes Pasadas</h1>
      <div className="sm:flex sm:flex-wrap -mx-3">
        {ordenes.map((orden, i) => {
          const fecha = new Date(orden.creado);
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
          const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

          return (
            <React.Fragment key={orden.id}>
              <div key={`${orden.id}-heading`} className="w-full">
                {mostrarHeading(fechaFormateada, i, ordenes)}
              </div>
              <div className="w-[100%] px-2 mb-3 hover:bg-blue-200">
                <Orden orden={orden} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default OrdenesPasadas;
