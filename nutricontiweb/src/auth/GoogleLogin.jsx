import { useState, useEffect } from 'react';
import firebase from "../firebase";
import Login from '../components/paginas/Login';

const GoogleLogin = () => {
    const [loading, setLoading] = useState(false);
    const [allowedUsers, setAllowedUsers] = useState([]);

    useEffect(() => {
        const fetchAllowedEmails = async () => {
            const snapshot = await firebase.db.collection('usuarios').get();
            setAllowedUsers(snapshot.docs.map(doc => ({ email: doc.data().email, servicio: doc.data().servicio })));
            setLoading(false);
        };

        fetchAllowedEmails();
    }, []);

    const handleLogin = () => {
        setLoading(true);
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((result) => {
            // Puedes acceder a la información del usuario aquí
            var user = result.user;
            const allowedUser = allowedUsers.find(u => u.email === user.email);
            if (allowedUser && allowedUser.servicio) {
                setLoading(false)

                // Actualiza la foto de perfil en Firestore
                firebase.db.collection('usuarios').doc(user.uid).update({ perfil: user.photoURL })
                    .catch((error) => {
                        console.error('Error al actualizar la foto de perfil: ', error);
                    });
            } else {
                // Si el correo electrónico del usuario no está en la lista de correos electrónicos permitidos, cierra la sesión
                firebase.auth().signOut();
                <Login />
                setLoading(false)
                alert('No tienes permiso para acceder a esta aplicación');
            }

        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    };
    return (
        <div>
            <button
                onClick={handleLogin}
                disabled={loading || allowedUsers.length === 0}
                className="w-full py-2 px-4 mt-2 text-white bg-red-500 hover:bg-red-600 rounded-full disabled:opacity-50"
            >
                <i className="fa-brands fa-google text-white fa-xl mr-2" />
                {loading ? 'Iniciando...' : 'Iniciar con Google'}
            </button>
        </div>
    );
};

export default GoogleLogin;