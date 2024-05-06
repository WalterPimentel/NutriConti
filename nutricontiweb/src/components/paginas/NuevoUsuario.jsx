import { useContext } from 'react';
import { useNavigate } from "react-router-dom"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FirebaseContext } from '../../firebase';

const NuevoUsuario = () => {
    const { firebase } = useContext(FirebaseContext);

    // Hook para redireccionar
    const navigate = useNavigate();

    // validación y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            dni: '',
            numero: '',
            nombres: '',
            apellidos: '',
            correo: '',
            puesto: ''
        },
        validationSchema: Yup.object({
            dni: Yup.string()
                .min(8, 'El DNI debe tener al menos 8 carácteres.')
                .required('El DNI es obligatorio.'),
            numero: Yup.string()
                .min(9, 'El número de celular debe tener al menos 9 carácteres.')
                .required('El número de celular es obligatorio.'),
            nombres: Yup.string()
                .min(3, 'Los nombres deben tener al menos 3 carácteres.')
                .required('Los nombres son obligatorios.'),
            apellidos: Yup.string()
                .min(3, 'Los apellidos deben tener al menos 3 carácteres.')
                .required('Los apellidos son obligatorios.'),
            correo: Yup.string()
                .email('El correo no es válido')
                .required('El correo es obligatorio.'),
            puesto: Yup.string()
                .required('El puesto es obligatorio.')
        }),
        onSubmit: usuario => {
            try {
                firebase.db.collection('usuarios').add(usuario);
                navigate('/usuarios');
            } catch (error) {
                console.log(error);
            }
        }
    });

    return (
        <>
            <h1 className="text-3xl text-center font-light mb-4">Agregar Usuario</h1>
            <div className="flex justify-center mt-10 w-full">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="w-full flex flex-row items-center">
                            <div className="w-full mb-4 mr-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="nombre"
                                >
                                    DNI
                                </label>
                                <div className="flex items-center">
                                    <i className="fas fa-id-card text-gray-800 fa-xl mr-2" />
                                    <input
                                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                        id="dni"
                                        name="dni"
                                        type="text"
                                        placeholder='Número de DNI'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                            <div className="w-full mb-4 ml-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="nombre"
                                >
                                    Número
                                </label>
                                <div className="flex items-center">
                                    <i className="fa-brands fa-whatsapp text-gray-800 fa-xl mr-2" />
                                    <input
                                        className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                        id="numero"
                                        name="numero"
                                        type="text"
                                        placeholder='Número de celular'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre"
                            >
                                Nombres
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-user-pen text-gray-800 fa-xl mr-2" />
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="nombres"
                                    name="nombres"
                                    type="text"
                                    placeholder='Nombres del usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre"
                            >
                                Apellidos
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-user-pen text-gray-800 fa-xl mr-2" />
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    placeholder='Apellidos del usuario'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre"
                            >
                                Correo
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-envelope text-gray-800 fa-xl mr-2" />
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    placeholder='usuario@dominio.com'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nombre"
                            >
                                Puesto
                            </label>
                            <div className="flex items-center">
                                <i className="fas fa-user-gear text-gray-800 fa-xl mr-2" />
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                                    id="puesto"
                                    name="puesto"
                                    value={formik.values.categoria}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">-- Seleccione --</option>
                                    <option value="caja">Caja</option>
                                    <option value="mesero">Mesero</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold flex justify-center items-center cursor-pointer"
                            onClick={formik.handleSubmit} // Asume que handleSubmit es tu función de envío
                        >
                            <i className="fas fa-floppy-disk mr-2 fa-lg"></i>
                            <input
                                type="submit"
                                value="Agregar Usuario"
                                className="focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NuevoUsuario;