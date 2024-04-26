import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FirebaseContext } from "../../firebase";

const DetallePlato = () => {

  const { firebase } = useContext(FirebaseContext);
  const { platilloId } = useParams();
  const [platillo, setPlatillo] = useState(null);
  const [infoNutricional, setInfoNutricional] = useState(null);

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

  const obtenerInformacionNutricional = async () => {
    try {
      const ingredientesParaApi = ingredientes.map(
        (ingrediente) => `${ingrediente}`
      );
      const ingredientData = { ingr: ingredientesParaApi };
      const apiUrl = "https://api.edamam.com/api/nutrition-details";
      const apiId = "daa2ca9d";
      const apiKey = "2ef44da5cb8e41aa1a930f5e77ca4b51";
      const url = `${apiUrl}?app_id=${apiId}&app_key=${apiKey}`;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingredientData),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      await firebase.db.collection("productos").doc(platilloId).update({
        informacionNutricional: data
      });

      setInfoNutricional(data);
    } catch (error) {
      console.error("Error al obtener la información nutricional: ", error);
    }
  };

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
          <h2 className="text-xl font-bold mb-2 text-center">Ingredientes</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Dividir la lista de ingredientes en dos grupos */}
            {ingredientes.reduce((groups, ingredient, index) => {
              const groupIndex = Math.floor(index / (ingredientes.length / 2));
              if (!groups[groupIndex]) {
                groups[groupIndex] = []; // Inicializar el grupo si aún no existe
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
        <div className="w-full text-center">
          <button
            onClick={obtenerInformacionNutricional}
            className="bg-blue-500 text-white p-2 mt-4 mb-4 flex-row items-center mx-auto"
          >
            Ver Información Nutricional de Ingredientes
          </button>
        </div>
        {infoNutricional && (
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">
              Información Nutricional de los Ingredientes
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Grupo de nutrientes */}
              <div className="text-left col-span-2">
                <p className="font-bold">Energía</p>
                <p>{infoNutricional.calories.toFixed(2)} kcal</p>
              </div>
              {/* Grupo de lípidos */}
              <div className="text-left">
                <p className="font-bold">Total lipid (fat)</p>
                <p>{infoNutricional.totalNutrients.FAT.quantity.toFixed(2)} {infoNutricional.totalNutrients.FAT.unit}</p>
                {/* Subgrupo de ácidos grasos */}
                <div className="ml-4">
                  <p className="font-bold">- Fatty acids, total saturated</p>
                  <p>{infoNutricional.totalNutrients.FASAT.quantity.toFixed(2)} {infoNutricional.totalNutrients.FASAT.unit}</p>
                </div>
                {/* Subgrupo de ácidos grasos monoinsaturados */}
                <div className="ml-4">
                  <p className="font-bold">- Fatty acids, total monounsaturated</p>
                  <p>{infoNutricional.totalNutrients.FAMS.quantity.toFixed(2)} {infoNutricional.totalNutrients.FAMS.unit}</p>
                </div>
                {/* Subgrupo de ácidos grasos poliinsaturados */}
                <div className="ml-4">
                  <p className="font-bold">- Fatty acids, total polyunsaturated</p>
                  <p>{infoNutricional.totalNutrients.FAPU.quantity.toFixed(2)} {infoNutricional.totalNutrients.FAPU.unit}</p>
                </div>
                {/* Subgrupo de ácidos grasos trans */}
                <div className="ml-4">
                  <p className="font-bold">- Fatty acids, total trans</p>
                  <p>{infoNutricional.totalNutrients.FATRN.quantity.toFixed(2)} {infoNutricional.totalNutrients.FATRN.unit}</p>
                </div>

              </div>
              {/* Grupo de Carbohidratos */}
              <div className="text-left">
                <p className="font-bold">Carbohydrate, by difference</p>
                <p>{infoNutricional.totalNutrients.CHOCDF.quantity.toFixed(2)} {infoNutricional.totalNutrients.CHOCDF.unit}</p>
                {/* Subgrupo de Fibra dietética */}
                <div className="ml-4">
                  <p className="font-bold">- Fiber, total dietary</p>
                  <p>{infoNutricional.totalNutrients.FIBTG.quantity.toFixed(2)} {infoNutricional.totalNutrients.FIBTG.unit}</p>
                </div>
                {/* Subgrupo de Azúcares */}
                <div className="ml-4">
                  <p className="font-bold">- Sugars, total</p>
                  <p>{infoNutricional.totalNutrients.SUGAR.quantity.toFixed(2)} {infoNutricional.totalNutrients.SUGAR.unit}</p>
                </div>
              </div>
              {/* Grupo de Proteínas */}
              <div className="text-left">
                <p className="font-bold">Protein</p>
                <p>{infoNutricional.totalNutrients.PROCNT.quantity.toFixed(2)} {infoNutricional.totalNutrients.PROCNT.unit}</p>
              </div>
              {/* Grupo de Micronutrientes */}
              <div className="text-left">
                <p className="font-bold">Micronutrientes:</p>
                {/* Subgrupo de Calcio */}
                <div className="ml-4">
                  <p className="font-bold">- Calcium, Ca</p>
                  <p>{infoNutricional.totalNutrients.CA.quantity.toFixed(2)} {infoNutricional.totalNutrients.CA.unit}</p>
                </div>
                {/* Subgrupo de Colesterol */}
                <div className="ml-4">
                  <p className="font-bold">- Cholesterol</p>
                  <p>{infoNutricional.totalNutrients.CHOLE.quantity.toFixed(2)} {infoNutricional.totalNutrients.CHOLE.unit}</p>
                </div>
                {/* Subgrupo de Hierro */}
                <div className="ml-4">
                  <p className="font-bold">- Iron, Fe</p>
                  <p>{infoNutricional.totalNutrients.FE.quantity.toFixed(2)} {infoNutricional.totalNutrients.FE.unit}</p>
                </div>
                {/* Subgrupo de Magnesio */}
                <div className="ml-4">
                  <p className="font-bold">- Magnesium, Mg</p>
                  <p>{infoNutricional.totalNutrients.MG.quantity.toFixed(2)} {infoNutricional.totalNutrients.MG.unit}</p>
                </div>
                {/* Subgrupo de Fósforo */}
                <div className="ml-4">
                  <p className="font-bold">- Fósforo, P</p>
                  <p>{infoNutricional.totalNutrients.P.quantity.toFixed(2)} {infoNutricional.totalNutrients.P.unit}</p>
                </div>
                {/* Subgrupo de Potasio */}
                <div className="ml-4">
                  <p className="font-bold">- Potasio, K</p>
                  <p>{infoNutricional.totalNutrients.K.quantity.toFixed(2)} {infoNutricional.totalNutrients.K.unit}</p>
                </div>
                {/* Subgrupo de Sodio */}
                <div className="ml-4">
                  <p className="font-bold">- Sodio, Na</p>
                  <p>{infoNutricional.totalNutrients.NA.quantity.toFixed(2)} {infoNutricional.totalNutrients.NA.unit}</p>
                </div>
                {/* Subgrupo de Vitamina A */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina A</p>
                  <p>{infoNutricional.totalNutrients.VITA_RAE.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITA_RAE.unit}</p>
                </div>
                {/* Subgrupo de Vitamina B-12 */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina B-12</p>
                  <p>{infoNutricional.totalNutrients.VITB12.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITB12.unit}</p>
                </div>
                {/* Subgrupo de Vitamina B-6 */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina B-6</p>
                  <p>{infoNutricional.totalNutrients.VITB6A.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITB6A.unit}</p>
                </div>
                {/* Subgrupo de Vitamina C */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina C</p>
                  <p>{infoNutricional.totalNutrients.VITC.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITC.unit}</p>
                </div>
                {/* Subgrupo de Vitamina D */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina D</p>
                  <p>{infoNutricional.totalNutrients.VITD.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITD.unit}</p>
                </div>
                {/* Subgrupo de Vitamina E */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina E</p>
                  <p>{infoNutricional.totalNutrients.TOCPHA.quantity.toFixed(2)} {infoNutricional.totalNutrients.TOCPHA.unit}</p>
                </div>
                {/* Subgrupo de Vitamina K */}
                <div className="ml-4">
                  <p className="font-bold">- Vitamina K</p>
                  <p>{infoNutricional.totalNutrients.VITK1.quantity.toFixed(2)} {infoNutricional.totalNutrients.VITK1.unit}</p>
                </div>
                {/* Subgrupo de Zinc */}
                <div className="ml-4">
                  <p className="font-bold">- Zinc, Zn</p>
                  <p>{infoNutricional.totalNutrients.ZN.quantity.toFixed(2)} {infoNutricional.totalNutrients.ZN.unit}</p>
                </div>
                {/* Subgrupo de Ácido Fólico */}
                <div className="ml-4">
                  <p className="font-bold">- Ácido Fólico</p>
                  <p>{infoNutricional.totalNutrients.FOLAC.quantity.toFixed(2)} {infoNutricional.totalNutrients.FOLAC.unit}</p>
                </div>
              </div>
              {/* Grupo de Otros */}
              <div className="text-left">
                <p className="font-bold">Otros:</p>
                {/* Subgrupo de Agua */}
                <div className="ml-4">
                  <p className="font-bold">- Water</p>
                  <p>{infoNutricional.totalNutrients.WATER.quantity.toFixed(2)} {infoNutricional.totalNutrients.WATER.unit}</p>
                </div>
              </div>
            </div>
          </div>
          /**
           * {infoNutricional && (
                <div className="p-4 flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Información Nutricional por Porción
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(infoNutricional.totalNutrients).sort((a, b) =>
                      infoNutricional.totalNutrients[a].index - infoNutricional.totalNutrients[b].index
                    ).map((nutrientKey) => (
                      <div className="text-center" key={nutrientKey}>
                        <p className="font-bold">{infoNutricional.totalNutrients[nutrientKey].label}</p>
                        <p className="text-xl font-bold">
                          {infoNutricional.totalNutrients[nutrientKey].quantity.toFixed(2)}
                          {infoNutricional.totalNutrients[nutrientKey].unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           */
        )}
      </div>
    </div>
  );
};

export default DetallePlato;
