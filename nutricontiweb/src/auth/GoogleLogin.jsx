import { useState, useEffect } from 'react';
import firebase from "../firebase";

const GoogleLogin = () => {
    const [loading, setLoading] = useState(false);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

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
            var user = result.user;
            const allowedUser = allowedUsers.find(u => u.email === user.email);
            if (allowedUser && allowedUser.servicio) {
                setLoading(false)

                firebase.db.collection('usuarios').doc(user.uid).update({ perfil: user.photoURL })
                    .catch((error) => {
                        console.error('Error al actualizar la foto de perfil: ', error);
                    });
            } else {                
                firebase.auth().signOut();
                setLoading(false)
                setErrorMessage('No tienes permiso para acceder a esta aplicación');
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
            {errorMessage &&
                <p className="text-red-500 mt-2 font-bold text-sm text-center">
                    <i className='fas fa-circle-exclamation' />
                    {errorMessage}
                </p>
            }
        </div>
    );
};

export default GoogleLogin;