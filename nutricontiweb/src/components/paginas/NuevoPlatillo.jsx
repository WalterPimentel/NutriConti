import {
    useContext,
    useState
} from "react";

import { useFormik } from "formik"
import * as Yup from "yup";

import { useNavigate } from "react-router-dom"

import { FirebaseContext } from '../../firebase';

import Ingredientes from '../ui/Ingredientes';

const NuevoPlatillo = () => {

    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlImagen, guardarUrlImagen] = useState('');
    const [error, guardarError] = useState(null);

    const { firebase } = useContext(FirebaseContext);

    const navigate = useNavigate();

    const obtenerInformacionNutricional = async (ingredientes) => {
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

            return data;
        } catch (error) {
            console.error("Error al obtener la información nutricional: ", error);
        }
    };

    const formik = useFormik({

        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            ingredientes: [],
            nuevoIngrediente: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, 'Los Platillos deben tener al menos 3 carácteres.')
                .required('El Nombre es obligatorio.'),
            precio: Yup.number()
                .typeError('El precio debe ser un número.')
                .min(1, 'El Precio debe ser mayor a 0.')
                .max(9999, 'El precio máximo es 9999.')
                .required('El Precio es obligatorio.'),
            categoria: Yup.string()
                .required('La Categoría es obligatoria.'),
            ingredientes: Yup.array()
                .of(
                    Yup.string()
                        .matches(/^[0-9]+(\/[0-9]+)? *(kg|g|dientes|cdas\.|tazas|cucharadas|cucharaditas)? .*$/, 'El Ingrediente debe contener al menos una medida y un ingrediente.')
                        .required('El ingrediente es requerido.')
                )
                .min(1, 'Debe haber al menos un Ingrediente.')
                .required('La lista de Ingredientes es obligatoria.'),
            descripcion: Yup.string()
                .min(10, 'La Descripción debe tener al menos 10 caracteres.')
                .required('La Descripción es obligatoria.'),
        }),
        onSubmit: async (platillo) => {
            try {
                platillo.existencia = true;
                platillo.imagen = urlImagen;

                const infoNutricional = await obtenerInformacionNutricional(platillo.ingredientes);
                platillo.informacionNutricional = infoNutricional;

                await firebase.db.collection('productos').add(platillo);
                navigate('/menu');
            } catch (error) {
                console.log(error);
            }
        }

    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleUpload(file);
    };

    const handleUpload = (file) => {
        guardarSubiendo(true);
        const storageRef = firebase.storage.ref(`productos/${Date.now()}-${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed', (snapshot) => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            guardarProgreso(percentage);
        }, (error) => {
            console.log(error.message);
            guardarSubiendo(false);
            guardarError(error.message);
        }, async () => {
            const url = await task.snapshot.ref.getDownloadURL();
            guardarUrlImagen(url);
            guardarSubiendo(false);
            guardarError(null);
        });
    };

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre"
                            >
                                Nombre
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-burger text-gray-800 fa-xl mr-2"></i>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Platillo"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>
                                    {formik.errors.nombre}
                                </p>
                            </div>
                        ) : null
                        }
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="precio"
                            >
                                Precio
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-coins text-gray-800 fa-xl mr-2"></i>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="precio"
                                    type="number"
                                    placeholder="0.00"
                                    min={1}
                                    max={9999}
                                    step="0.01"
                                    value={formik.values.precio}
                                    onChange={e => {
                                        let value = parseFloat(e.target.value);
                                        if (!isNaN(value)) {
                                            value = Math.round(value * 100) / 100; // Redondea a dos decimales
                                            formik.setFieldValue('precio', value);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>
                                    {formik.errors.precio}
                                </p>
                            </div>
                        ) : null
                        }
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="categoria"
                            >
                                Categoria
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-list fa-xl text-gray-800 mr-2"></i>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="categoria"
                                    name="categoria"
                                    value={formik.values.categoria}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">-- Seleccione --</option>
                                    <option value="desayuno">Desayuno</option>
                                    <option value="almuerzo">Almuerzo</option>
                                    <option value="cena">Cena</option>
                                    <option value="bebida">Bebida</option>
                                    <option value="postre">Postre</option>
                                    <option value="ensalada">Ensalada</option>
                                </select>
                            </div>
                        </div>
                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>
                                    {formik.errors.categoria}
                                </p>
                            </div>
                        ) : null
                        }
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="imagen"
                            >
                                Imagen
                                <img src={urlImagen} />
                            </label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        {subiendo && (
                            <div className="h-12 w-full border relative">
                                <div className="bg-green-500 absolute text-white px-2 text-sm h-12 flex items-center min-w-10" style={{ width: `${progreso}%` }}>
                                    {progreso.toFixed(0)} %
                                </div>
                            </div>
                        )}
                        {urlImagen && (
                            <div className="bg-green-200 border-l-4 border-green-500 text-green-700 p-4 mb-5" role="status">
                                <p>
                                    La imagen se subió correctamente.
                                </p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-200 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="status">
                                <p>
                                    Hubo un error al subir la imagen: {error}
                                </p>
                            </div>
                        )}
                        <Ingredientes formik={formik} />
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="descripcion"
                            >
                                Descripción
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-xl fa-file-pen text-gray-800 mr-2"></i>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="descripcion"
                                    placeholder="Descripción del Platillo"
                                    value={formik.values.descripcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                ></textarea>
                            </div>
                        </div>
                        {
                            formik.touched.descripcion && formik.errors.descripcion ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                    <p className="font-bold">Hubo un error:</p>
                                    <p>
                                        {formik.errors.descripcion}
                                    </p>
                                </div>
                            ) : null
                        }
                        <div
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold flex justify-center items-center cursor-pointer"
                            onClick={formik.handleSubmit}
                        >
                            <i className="fas fa-floppy-disk mr-2 fa-lg"></i>
                            <input
                                type="submit"
                                value="Agregar Platillo"
                                className="focus:outline-none cursor-pointer"
                            />
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default NuevoPlatillo;
