import { useContext, useRef } from "react";
import { FirebaseContext } from "../../firebase";

const Usuario = ({ usuario }) => {

    // Existencia ref para acceder al valor directamente
    const servicioRef = useRef(usuario.existencia);

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
    }

    const eliminarUsuario = async () => {
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
                throw new Error("Error en: ", data.message);
            }

            alert('Usuario eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el usuario: ', error);
            alert('Error al eliminar el usuario');
        }
    };

    const usuarioPerfil = "https://firebasestorage.googleapis.com/v0/b/nutriconti-429d5.appspot.com/o/assets%2F5f404cb82ee5ee52ce0261c6_33497.png?alt=media&token=def284a8-e7e4-4457-90db-4a55340f28fb"

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="w-auto">
                        <img src={fotoPerfil ? fotoPerfil : usuarioPerfil} alt={dni} className="rounded-full size-24" />
                        <label className="block mt-5 w-auto">
                            <span className="block text-gray-800 mb-2">Estado</span>
                            <select
                                className={`text-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-inset ${servicio === true ? 'bg-emerald-500' : 'bg-red-500'}`}
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
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{apellidos}, {nombres}</p>
                        <p className="text-gray-600 mb-4">Puesto:{' '}
                            <span className="text-gray-700 font-bold">{puesto.toUpperCase()}</span>
                        </p>
                        <p className="text-gray-600 mb-4">{email}
                        </p>
                        <span className="text-gray-700 font-bold italic">{numero}</span>
                    </div>
                    <div className="ml-4 w-auto">
                        <button onClick={eliminarUsuario}>
                            <i className="fas fa-trash-can text-red-800 fa-xl mr-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Usuario;