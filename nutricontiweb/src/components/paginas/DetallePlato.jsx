import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FirebaseContext } from "../../firebase";

const DetallePlato = () => {

  const { firebase } = useContext(FirebaseContext);
  const { platilloId } = useParams();
  const [platillo, setPlatillo] = useState(null);

  useEffect(() => {
    const obtenerPlatillo = async () => {
      try {
        const doc = await firebase.db.collection("productos").doc(platilloId).get();
        if (doc.exists) {
          setPlatillo({ id: doc.id, ...doc.data() });
        } else {
          console.log("No se encontró el platillo con el ID especificado.");
        }
      } catch (error) {
        console.error("Error al obtener el platillo:", error);
      }
    };
    obtenerPlatillo();
  }, [firebase.db, platilloId]);


  if (!platillo) {
    return <div>Cargando el detalle del platillo...</div>;
  }

  const {
    nombre,
    imagen,
    descripcion,
    existencia,
    categoria,
    ingredientes,
    precio
  } = platillo;

  const clasificarPlatillo = (informacionNutricional) => {
    if (!informacionNutricional) return '';

    const { calories, totalNutrients } = informacionNutricional;
    const { PROCNT, CHOCDF } = totalNutrients;

    const porcentajeCarbohidratos = (CHOCDF.quantity * 4) / calories * 100;
    const porcentajeProteinas = (PROCNT.quantity * 4) / calories * 100;

    let clasificacion = '';
    if (porcentajeCarbohidratos < 45) {
      clasificacion += 'Bajo en carbohidratos';
    } else {
      clasificacion += 'Alto en carbohidratos';
    }
    if (porcentajeProteinas >= 20) {
      if (clasificacion !== '') clasificacion += ' y ';
      clasificacion += 'rico en proteínas.';
    } else {
      if (clasificacion !== '') clasificacion += ' y ';
      clasificacion += 'pobre en proteínas.';
    }

    return clasificacion;
  };

  const mostrarInformacioNutricional = () => {
    if (!platillo.informacionNutricional) return null;

    const { calories, totalNutrients } = platillo.informacionNutricional;
    const { PROCNT, FAT, CHOCDF, NA, CHOLE } = totalNutrients;
    const alergenos = platillo.informacionNutricional.cautions || [];

    const clasificacion = clasificarPlatillo(platillo.informacionNutricional);

    return (
      <div className="w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-center">
          Información Nutricional
        </h2>
        <p>Calorías: {calories} kcal</p>
        <p>Proteínas: {PROCNT.quantity.toFixed(1)} {PROCNT.unit}</p>
        <p>Carbohidratos: {CHOCDF.quantity.toFixed(1)} {CHOCDF.unit}</p>
        <p>Grasas: {FAT.quantity.toFixed(1)} {FAT.unit}</p>
        <p>Sodio: {NA.quantity.toFixed(1)} {FAT.unit}</p>
        <p>Colesterol: {CHOLE.quantity.toFixed(1)} {FAT.unit}</p>
        {alergenos.length > 0 && <p>Alérgenos: {alergenos.join(', ')}</p>}
        <div className="mt-3 mb-2">
          <p className="italic text-sm">*Análisis Nutricional según los ingredientes.</p>
          <p className="italic text-sm">*{clasificacion}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-1 mb-1">
      <div className=" mx-auto bg-white shadow-lg rounded-md overflow-hidden">
        <div className="bg-gray-100 p-4">
          <p className="font-bold text-2xl text-yellow-600 mb-4 text-center">{nombre}</p>
          <img
            src={imagen}
            alt={nombre}
            className="max-w-full h-aut flex justify-center mx-auto"
          />
          <p className={`font-bold p-1 truncate text-center ${existencia ? "bg-green-400" : "bg-red-400"}`}>{existencia ? "Disponible" : "No Disponible"}</p>
          <div className="lg:flex text-center">
            <div className="p-4 lg:w-1/2 xl:w-1/2">
              <p className="text-gray-600 mb-1">Precio</p>
              <span className="text-gray-700 font-bold">S/. {precio}</span>
            </div>
            <div className="p-4 lg:w-1/2 xl:w-1/2">
              <p className="text-gray-600 mb-1">Categoría</p>
              <span className="text-gray-700 font-bold">{categoria.toUpperCase()}</span>
            </div>
          </div>
          <p className="text-gray-700">{descripcion}</p>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Ingredientes</h2>
          <div className="grid grid-cols-2 gap-4">
            {ingredientes.reduce((groups, ingredient, index) => {
              const groupIndex = Math.floor(index / (ingredientes.length / 2));
              if (!groups[groupIndex]) {
                groups[groupIndex] = [];
              }
              groups[groupIndex].push(ingredient);
              return groups;
            }, []).map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="list-none">
                  {group.map((ingredient, index) => (
                    <li key={index}>
                      <div className="flex items-center">
                        <i className="fas fa-check mr-1"></i>
                        <span>{ingredient}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {mostrarInformacioNutricional()}
      </div>
    </div>
  );
};

export default DetallePlato;
