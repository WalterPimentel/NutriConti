import {
    useContext,
    useState
} from "react";

import { useFormik } from "formik"
import * as Yup from "yup";

import { useNavigate } from "react-router-dom"

import { FirebaseContext } from '../../firebase';
import FileUploader from "react-firebase-file-uploader";

import Ingredientes from '../ui/Ingredientes';

const NuevoPlatillo = () => {

    // state para las imágenes
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlImagen, guardarUrlImagen] = useState('');

    //Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();

    //validación y leer los datos del formulario
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
                .min(1, 'Debes agregar un número.')
                .required('El Precio es obligatorio.'),
            categoria: Yup.string()
                .required('La Categoría es obligatoria.'),
            ingredientes: Yup.array()
                .of(Yup.string().matches(/^\d+(\.\d+)? ?(gr|kg|ml|cl|l|oz)? \w+$/, 'El formato de uno de los ingredientes es inválido. ')) // Valida el formato del ingrediente
                .min(1, 'Debe haber al menos un ingrediente.') // Valida que haya al menos un ingrediente
                .required('La lista de ingredientes es obligatoria.'), // Valida que el campo no esté vacío
            descripcion: Yup.string()
                .min(10, 'La Descripción debe tener al menos 10 caracteres.')
                .required('La Descripción es obligatoria.'),
        }),
        onSubmit: platillo => {

            try {
                platillo.existencia = true;
                platillo.imagen = urlImagen;
                firebase.db.collection('productos').add(platillo);
                navigate('/menu');
            } catch (error) {
                console.log(error);
            }
        }

    });

    // Todo sobre las imágenes
    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }
    const handleUploadError = error => {
        guardarSubiendo(false);
        console.log(error);
    }
    const handleUploadSuccess = async nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);

        // Almacenar la URL de destino
        const url = await firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL();

        console.log(url);
        guardarUrlImagen(url);

    }
    const handleProgress = progreso => {
        guardarProgreso(progreso);
        console.log(progreso);
    }

    return (
        <>

            <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form
                        onSubmit={formik.handleSubmit}
                    >
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
                                    min="0"
                                    value={formik.values.precio}
                                    onChange={formik.handleChange}
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
                                <img src={urlImagen} alt=" Imagen platillo " />
                            </label>
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>
                        {subiendo && (
                            // Si se esta subiendo mostrar porcentaje de carga
                            <div className="h-12 w-full border relative">
                                <div className="bg-green-500 absolute text-white px-2 text-sm h-12 flex items-center min-w-10" style={{ width: `${progreso}%` }}>
                                    {progreso} %
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
                            onClick={formik.handleSubmit} // Asume que handleSubmit es tu función de envío
                        >
                            <i className="fas fa-floppy-disk mr-2 fa-lg"></i>
                            <input
                                type="submit"
                                value="Agregar Platillo"
                                className="focus:outline-none"
                            />
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default NuevoPlatillo;
