import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLoading } from "../../contexts/useLoading";
import Modal from "../ui/Modal";

const NuevoUsuario = () => {

    const navigate = useNavigate();

    const setLoading = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createdUserName, setCreatedUserName] = useState('');

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
                .matches(/^[0-9]+$/, "El DNI solo debe contener números.")
                .length(8, 'El DNI debe tener exactamente 8 dígitos.')
                .required('El DNI es obligatorio.')
                .test('checkDni', 'Este DNI ya se encuentra registrado', async value => {
                    try {
                        const response = await axios.get(`http://localhost:3001/checkDni/${value}`);
                        return !response.data.exists;
                    } catch (error) {
                        return false;
                    }
                }),
            numero: Yup.string()
                .matches(/^9[0-9]{8}$/, "El Número de celular debe ser verídico.")
                .length(9, 'El Número de celular debe tener exactamente 9 carácteres.')
                .required('El Número de celular es obligatorio.'),
            nombres: Yup.string()
                .matches(/^[A-Za-zñÑ\s]+$/, "Los Nombres solo deben contener letras.")
                .min(3, 'Los Nombres deben tener al menos 3 carácteres.')
                .required('Los Nombres son obligatorios.'),
            apellidos: Yup.string()
                .matches(/^[A-Za-zñÑ\s]+$/, "Los Nombres solo deben contener letras.")
                .min(3, 'Los Apellidos deben tener al menos 3 carácteres.')
                .required('Los Apellidos son obligatorios.'),
            correo: Yup.string()
                .email('El Correo no es válido.')
                .required('El Correo es obligatorio.')
                .test('dominio', 'El correo debe ser de dominio gmail, outlook, hotmail o yahoo.', value => {
                    const regex = /@(gmail|outlook|hotmail|yahoo)\.com$/;
                    return regex.test(value);
                })
                .test('checkEmail', 'Este Correo ya se encuentra registrado', async value => {
                    try {
                        const response = await axios.get(`http://localhost:3001/checkUser/${value}`);
                        return !response.data.exists;
                    } catch (error) {
                        return false;
                    }
                }),
            puesto: Yup.string()
                .oneOf(['administrador', 'caja', 'mesero'], 'El Puesto no es válido.')
                .required('El Puesto es obligatorio.')
        }),
        onSubmit: usuario => {
            setLoading(true);
            const password = usuario.dni.toString();
            const servicio = true;
            const { correo, ...rest } = usuario;
            axios.post('http://localhost:3001/createUser', { email: correo, password, servicio, ...rest })
                .then(() => {
                    setLoading(false);
                    setIsModalOpen(true);
                    setCreatedUserName(usuario.nombres);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
        }
    });

    const closeModalAndNavigate = () => {
        setIsModalOpen(false);
        navigate('/usuarios');
    };

    return (
        <>
            <div>
                <h1 className="text-3xl text-center font-light mb-4">Agregar Usuario</h1>
                <div className="flex justify-center mt-10 w-full">
                    <div className="w-full max-w-3xl">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="w-full flex flex-row items-center">
                                <div className="w-full mb-4 mr-2">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="dni"
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
                                            maxLength={8}
                                            placeholder='Número de DNI'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            onKeyDown={event => {
                                                if (!/[0-9]/.test(event.key)
                                                    && !event.ctrlKey
                                                    && !event.metaKey
                                                    && event.key !== 'Backspace'
                                                    && event.key !== 'ArrowLeft'
                                                    && event.key !== 'ArrowRight'
                                                    && event.key !== 'Home'
                                                    && event.key !== 'End'
                                                    && event.key !== 'Tab') {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    {formik.touched.dni && formik.errors.dni ? (
                                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mt-3 mb-4" role="alert">
                                            <p className="font-bold">Hubo un error:</p>
                                            <p>
                                                {formik.errors.dni}
                                            </p>
                                        </div>
                                    ) : null
                                    }
                                </div>
                                <div className="w-full mb-4 ml-2">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="numero"
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
                                            maxLength={9}
                                            placeholder='Número de celular'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            onKeyDown={event => {
                                                if (!/[0-9]/.test(event.key)
                                                    && !event.ctrlKey
                                                    && !event.metaKey
                                                    && event.key !== 'Backspace'
                                                    && event.key !== 'ArrowLeft'
                                                    && event.key !== 'ArrowRight'
                                                    && event.key !== 'Home'
                                                    && event.key !== 'End'
                                                    && event.key !== 'Tab') {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    {formik.touched.numero && formik.errors.numero ? (
                                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-3 mb-4" role="alert">
                                            <p className="font-bold">Hubo un error:</p>
                                            <p>
                                                {formik.errors.numero}
                                            </p>
                                        </div>
                                    ) : null
                                    }
                                </div>
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="nombres"
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
                            {formik.touched.nombres && formik.errors.nombres ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mt-3 mb-4" role="alert">
                                    <p className="font-bold">Hubo un error:</p>
                                    <p>
                                        {formik.errors.nombres}
                                    </p>
                                </div>
                            ) : null
                            }
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="apellidos"
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
                            {formik.touched.apellidos && formik.errors.apellidos ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mt-3 mb-4" role="alert">
                                    <p className="font-bold">Hubo un error:</p>
                                    <p>
                                        {formik.errors.apellidos}
                                    </p>
                                </div>
                            ) : null
                            }
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="correo"
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
                            {formik.touched.correo && formik.errors.correo ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mt-3 mb-4" role="alert">
                                    <p className="font-bold">Hubo un error:</p>
                                    <p>
                                        {formik.errors.correo}
                                    </p>
                                </div>
                            ) : null
                            }
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="puesto"
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
                            {formik.touched.puesto && formik.errors.puesto ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4  mt-3 mb-4" role="alert">
                                    <p className="font-bold">Hubo un error:</p>
                                    <p>
                                        {formik.errors.puesto}
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
                                    value="Agregar Usuario"
                                    className="focus:outline-none hover:cursor-pointer"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                iconClass="far fa-circle-check text-emerald-500 fa-2xl mt-6"
                title="Usuario Registrado"
                message={`${createdUserName} fue registrado correctamente.`}
                onClose={closeModalAndNavigate}
                closeText="Aceptar"
            />
        </>
    );
};

export default NuevoUsuario;