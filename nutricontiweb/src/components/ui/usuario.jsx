import { useContext, useRef, useState } from "react";
import { FirebaseContext } from "../../firebase";
import LoadingSpinner from "./LoadingSpinner";

const Usuario = ({ usuario }) => {

    // Existencia ref para acceder al valor directamente
    const servicioRef = useRef(usuario.existencia);

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // context de firebase para cambios en la BD
    const { firebase } = useContext(FirebaseContext)

    const {
        id,
        fotoPerfil,
        dni,
        apellidos,
        nombres,
        email,
        puesto,
        servicio,
        numero
    } = usuario;

    // Modificar el estado del usuario en firebase
    const actualizarDisponibilidad = () => {
        const servicio = (servicioRef.current.value === "true");
        try {
            firebase.db.collection('usuarios')
                .doc(id)
                .update({
                    servicio
                });
        } catch (error) {
            console.log(error);
        }
    };

    const confirmarEliminacion = async () => {
        setIsModalOpen(false);
        setIsLoading(true);
        try {
            // Elimina el usuario de Firestore
            await firebase.db.collection('usuarios').doc(id).delete();

            // Llama a la función del servidor para eliminar el usuario de Firebase Authentication
            const response = await fetch('http://localhost:3001/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: id }),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                throw new Error("Error en: ", data.message);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error al eliminar el usuario: ', error);
            alert('Error al eliminar el usuario');
        }
    };

    const cancelarEliminacion = () => {
        setIsModalOpen(false);
    };

    const usuarioPerfil = "https://firebasestorage.googleapis.com/v0/b/nutriconti-429d5.appspot.com/o/assets%2F5f404cb82ee5ee52ce0261c6_33497.png?alt=media&token=def284a8-e7e4-4457-90db-4a55340f28fb"

    return (
        <>
            {
                isModalOpen && (
                    <div
                        className="fixed z-10 inset-0 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
                        >
                            <div
                                className="fixed inset-0 bg-gray-500 backdrop-blur-sm bg-opacity-50 transition-opacity"
                                aria-hidden="true"
                            >
                            </div>
                            <span
                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                aria-hidden="true"
                            >&#8203;
                            </span>
                            <div
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <i className="far fa-circle-question text-yellow-400 fa-2xl mt-8" />
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3
                                                className="text-lg leading-6 font-medium text-gray-900"
                                                id="modal-title">
                                                Confirmar eliminación
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    ¿Estás seguro de que quieres eliminar el usuario {nombres}?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={confirmarEliminacion}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={cancelarEliminacion}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {isLoading ? (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    backgroundColor: '#1F2937'
                }}>
                    <LoadingSpinner />
                </div>
            ) : (

                <div className="w-full px-3 mb-4 relative">
                    <div className="p-5 shadow-md bg-white">
                        <button onClick={() => setIsModalOpen(true)} className="absolute top-2 right-2 mr-1">
                            <i className="fas fa-trash-can text-red-800 fa-xl mr-2" />
                        </button>
                        <div className="lg:flex">
                            <div className="w-auto">
                                <img src={fotoPerfil ? fotoPerfil : usuarioPerfil} alt={dni} className="rounded-full size-24" />
                                <label className="block mt-5 w-auto">
                                    <span className="block text-gray-800 mb-2">Estado</span>
                                    <select
                                        className={`text-white shadow appearance-none border rounded w-auto md:w-full sm:w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-inset ${servicio === true ? 'bg-emerald-500' : 'bg-red-500'}`}
                                        value={servicio}
                                        ref={servicioRef}
                                        onChange={() => actualizarDisponibilidad()}
                                    >
                                        <option value="true" className="bg-white text-black">En servicio</option>
                                        <option value="false" className="bg-white text-black">Inactivo</option>
                                    </select>
                                </label>
                            </div>
                            <div className="ml-4 w-auto">
                                <p className="font-bold text-2xl text-yellow-600 mb-4">{nombres}, {apellidos}</p>
                                <p className="text-gray-600 mb-4">DNI:{' '}
                                    <span className="text-gray-700 font-bold">{dni}</span>
                                </p>
                                <p className="text-gray-600 mb-4">Puesto:{' '}
                                    <span className="text-gray-700 font-bold">{puesto.toUpperCase()}</span>
                                </p>
                                <p className="text-gray-600 mb-4">{email}
                                </p>
                                <p className="text-gray-600 mb-4">Número:{' '}
                                    <span className="text-gray-700 font-bold italic">{numero}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Usuario;