import { useState, useEffect } from 'react';
import firebase from "../firebase";
import Login from '../components/paginas/Login';

const ProvidersLogin = () => {
    const [loading, setLoading] = useState(false);
    const [allowedEmails, setAllowedEmails] = useState([]);

    useEffect(() => {
        const fetchAllowedEmails = async () => {
            const snapshot = await firebase.db.collection('usuarios').get();
            setAllowedEmails(snapshot.docs.map(doc => doc.data().correo));
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
            if (allowedEmails.includes(user.email)) {
                console.log(user);
                setLoading(false)
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
                disabled={loading || allowedEmails.length === 0}
                className="w-full py-2 px-4 mt-2 text-white bg-red-500 hover:bg-red-600 rounded-full disabled:opacity-50"
            >
                <i className="fa-brands fa-google text-white fa-xl mr-2" />
                {loading ? 'Iniciando...' : 'Iniciar con Google'}
            </button>
        </div>
    );
};

export default ProvidersLogin;