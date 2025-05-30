import { useContext, useRef, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { useLoading } from "../../contexts/useLoading";
import Modal from "./Modal";
import axios from 'axios';

const Usuario = ({
    usuario,
    modalExito,
    setModalExito,
    createdUserName,
    setCreatedUserName
}) => {

    const servicioRef = useRef(usuario.existencia);

    const setLoading = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { firebase } = useContext(FirebaseContext)

    const {
        id,
        perfil,
        dni,
        apellidos,
        nombres,
        email,
        puesto,
        servicio,
        numero
    } = usuario;

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

    const confirmarEliminacion = usuario => {
        setLoading(true);
        setCreatedUserName(usuario.nombres);
        firebase.db.collection('usuarios').doc(id).delete()
            .then(() => {
                axios.delete('http://localhost:3001/deleteUser', { data: { uid: id } })
                    .then(() => {
                        setLoading(false);
                        setModalExito(true);
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log(error);
                    });
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const cerrarModalExito = () => {
        setModalExito(false);
    }

    const cancelarEliminacion = () => {
        setIsModalOpen(false);
    };

    const usuarioPerfil = "https://firebasestorage.googleapis.com/v0/b/nutriconti-429d5.appspot.com/o/assets%2F5f404cb82ee5ee52ce0261c6_33497.png?alt=media&token=def284a8-e7e4-4457-90db-4a55340f28fb"

    return (
        <>
            <div className="w-full shadow-md px-3 mb-4 hover:drop-shadow-xl">
                <div className="p-5 shadow-md bg-white">
                    <div className="relative">
                        <button onClick={() => setIsModalOpen(true)} className="absolute right-2">
                            <i className="fas fa-trash-can text-red-800 fa-xl" />
                        </button>
                    </div>
                    <div className="lg:flex">
                        <div className="w-auto">
                            <img src={perfil ? perfil : usuarioPerfil} alt={dni} className="rounded-full size-24" />
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
            <Modal
                isOpen={isModalOpen}
                iconClass="far fa-circle-question text-yellow-400 fa-2xl mt-8"
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el usuario ${nombres}?`}
                onClose={cancelarEliminacion}
                onConfirm={() => confirmarEliminacion(usuario)}
                confirmText="Eliminar"
                closeText="Cancelar"
            />
            <Modal
                isOpen={modalExito}
                iconClass="far fa-circle-check text-emerald-500 fa-2xl mt-6"
                title="Usuario Eliminado"
                message={`${createdUserName} fue eliminado correctamente.`}
                onClose={cerrarModalExito}
                closeText="Aceptar"
            />
        </>
    );
}

export default Usuario;
