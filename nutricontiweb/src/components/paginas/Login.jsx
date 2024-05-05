import { useState, useEffect } from 'react';
import firebase from "../../firebase";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [allowedEmails, setAllowedEmails] = useState([]);

    useEffect(() => {
        const fetchAllowedEmails = async () => {
            const snapshot = await firebase.firebase.firestore().collection('usuarios').get();
            setAllowedEmails(snapshot.docs.map(doc => doc.data().correo));
        };

        fetchAllowedEmails();
    }, []);

    const handleLogin = () => {
        setLoading(true);
        const provider = new firebase.firebase.auth.GoogleAuthProvider();

        firebase.firebase.auth().signInWithPopup(provider).then((result) => {
            // Puedes acceder a la información del usuario aquí
            var user = result.user;
            if (allowedEmails.includes(user.email)) {
                console.log(user);
            } else {
                // Si el correo electrónico del usuario no está en la lista de correos electrónicos permitidos, cierra la sesión
                firebase.firebase.auth().signOut();
                alert('No tienes permiso para acceder a esta aplicación');
            }
            setLoading(false);

        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    };

    return (
        <div>
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar sesión con Google'}
            </button>
        </div>
    );
};

export default Login;