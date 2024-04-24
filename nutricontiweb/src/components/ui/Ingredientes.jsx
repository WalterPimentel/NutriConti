import check from '../../assets/check.png';

const Ingredientes = ({ formik }) => {
  const agregarIngrediente = (e) => {
    e.preventDefault();
    if (formik.values.nuevoIngrediente.trim() !== '') {
      formik.setFieldValue('ingredientes', [...formik.values.ingredientes, formik.values.nuevoIngrediente]);
      formik.setFieldValue('nuevoIngrediente', ''); // Cambiado para usar formik para establecer el valor
      console.log('Lista de ingredientes:', formik.values.ingredientes);
    }
  };
  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = [...formik.values.ingredientes];
    nuevosIngredientes.splice(index, 1);
    formik.setFieldValue('ingredientes', nuevosIngredientes);
  };
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredientes">
        Ingredientes
      </label>
      <div className="mb-4 flex flex-row items-center">
        <input

          id="ingredientes"
          name="ingredientes"
          className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
          placeholder="100 gr ingrediente"
          value={formik.values.nuevoIngrediente}
          onChange={(e) => formik.setFieldValue('nuevoIngrediente', e.target.value)}
          onBlur={formik.handleBlur}
        />
        <button
          onClick={agregarIngrediente}
          className="ml-2 text-center h-full bg-gray-800 block hover:bg-gray-600 w-1/2 text-white uppercase py-2.5 px-3 font-bold text-sm cursor-pointer transition duration-150 ease-in-out transform-gpu group-hover:scale-105"
        >
          Agregar
        </button>
      </div>
      {formik.touched.ingredientes && formik.errors.ingredientes ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p className="font-bold">Hubo un error:</p>
          <p>{formik.errors.ingredientes}</p>
        </div>
      ) : null}
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredientes">
          Lista de Ingredientes
        </label>
        <div className="grid grid-cols-2 gap-4">
          {formik.values.ingredientes.map((ingrediente, index) => (
            <div key={index} className="bg-white p-4 shadow rounded flex items-center mb-2">
              <img src={check} className="w-5 mr-2" alt="check" />
              <p>{ingrediente}</p>
              <button
                onClick={() => eliminarIngrediente(index)}
                className="text-red-600 hover:text-red-800"
              >
                <img src={check} className="w-5 mr-2" alt="check"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ingredientes;

